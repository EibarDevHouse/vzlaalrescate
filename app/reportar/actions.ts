"use server";

import { createClient } from "@/lib/supabase/server";
import {
  missingPersonFormSchema,
  createMissingPersonInputSchema,
} from "@/lib/validations/missing-person.schema";
import { generateSyntheticCedula } from "@/lib/utils/cedula";
import { z } from "zod";

interface DuplicateMatch {
  cedula: string;
  nombre_completo: string;
  ultima_ubicacion: string;
  tiene_cedula: boolean;
}

export type CreateMissingPersonResult =
  | { success: true; cedula: string }
  | {
      success: false;
      errorType:
        | "DUPLICATE_CEDULA"
        | "POSSIBLE_DUPLICATE"
        | "VALIDATION_ERROR"
        | "UNKNOWN";
      cedula?: string;
      message?: string;
      matches?: DuplicateMatch[];
    };

export async function createMissingPerson(
  formData: z.infer<typeof missingPersonFormSchema>,
  fotoUrl: string,
  forceInsert?: boolean
): Promise<CreateMissingPersonResult> {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        errorType: "UNKNOWN",
        message: "Debes estar autenticado",
      };
    }

    // Validate data
    const validatedData = missingPersonFormSchema.parse(formData);

    // Determine cedula: use provided or generate synthetic
    let cedula: string;
    let tieneCedula = true;
    let requiereRevision = false;

    if (validatedData.sinCedula) {
      cedula = generateSyntheticCedula();
      tieneCedula = false;
      requiereRevision = true;
    } else {
      // Normalize cedula if provided (trim, uppercase, remove spaces/dots)
      const rawCedula = validatedData.cedula || "";
      const normalized = rawCedula.trim().toUpperCase().replace(/[\s.]/g, "");
      const match = normalized.match(/^([VE])-?(\d{7,8})$/);
      cedula = match ? `${match[1]}-${match[2]}` : normalized;
    }

    // Check for possible duplicates when reporting without cedula
    if (validatedData.sinCedula && !forceInsert) {
      const { data: matches, error: matchError } = await supabase.rpc(
        "find_similar_missing_persons",
        {
          search_name: validatedData.nombreCompleto,
          similarity_threshold: 0.4,
        }
      );

      if (!matchError && matches && matches.length > 0) {
        return {
          success: false,
          errorType: "POSSIBLE_DUPLICATE",
          matches: matches as DuplicateMatch[],
          message:
            "Encontramos reportes con nombres similares. ¿Confirmas que es una persona distinta?",
        };
      }
    }

    // Insert into database
    const { error: insertError } = await supabase
      .from("missing_persons")
      .insert({
        cedula,
        nombre_completo: validatedData.nombreCompleto,
        descripcion_fisica: validatedData.descripcionFisica,
        ultima_ubicacion: validatedData.ultimaUbicacion,
        foto_url: fotoUrl,
        reportante_nombre: validatedData.reportanteNombre,
        reportante_telefono: validatedData.reportanteTelefono,
        reportante_relacion: validatedData.reportanteRelacion,
        reportado_por: user.id,
        edad_aprox: validatedData.edadAprox,
        genero: validatedData.genero,
        color_piel: validatedData.colorPiel,
        color_cabello: validatedData.colorCabello,
        color_ojos: validatedData.colorOjos,
        usa_lentes: validatedData.usaLentes,
        estatura_cm: validatedData.estaturaCm,
        peso_kg: validatedData.pesoCm,
        tiene_cedula: tieneCedula,
        requiere_revision: requiereRevision,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        return {
          success: false,
          errorType: "DUPLICATE_CEDULA",
          cedula,
        };
      }

      return {
        success: false,
        errorType: "UNKNOWN",
        message: insertError.message,
      };
    }

    return { success: true, cedula };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        errorType: "VALIDATION_ERROR",
        message: firstError?.message || "Error de validación",
      };
    }

    return {
      success: false,
      errorType: "UNKNOWN",
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
