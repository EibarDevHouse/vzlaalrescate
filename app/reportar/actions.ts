"use server";

import { createClient } from "@/lib/supabase/server";
import { missingPersonFormSchema } from "@/lib/validations/missing-person.schema";
import { z } from "zod";

export type CreateMissingPersonResult =
  | { success: true }
  | {
      success: false;
      errorType: "DUPLICATE_CEDULA" | "VALIDATION_ERROR" | "UNKNOWN";
      cedula?: string;
      message?: string;
    };

export async function createMissingPerson(
  formData: z.infer<typeof missingPersonFormSchema>,
  fotoUrl: string
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

    // Insert into database
    const { error: insertError } = await supabase
      .from("missing_persons")
      .insert({
        cedula: validatedData.cedula,
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
      });

    if (insertError) {
      if (insertError.code === "23505") {
        return {
          success: false,
          errorType: "DUPLICATE_CEDULA",
          cedula: validatedData.cedula,
        };
      }

      return {
        success: false,
        errorType: "UNKNOWN",
        message: insertError.message,
      };
    }

    return { success: true };
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
