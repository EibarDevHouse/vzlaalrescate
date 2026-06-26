"use server";

import { createClient } from "@/lib/supabase/server";
import { missingPetServerSchema } from "@/lib/validations/missing-pet.schema";
import { z } from "zod";

export type CreateMissingPetResult =
  | { success: true }
  | {
      success: false;
      errorType: "VALIDATION_ERROR" | "UNKNOWN";
      message?: string;
    };

export async function createMissingPet(
  formData: z.infer<typeof missingPetServerSchema>,
  fotoUrl: string
): Promise<CreateMissingPetResult> {
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
    const validatedData = missingPetServerSchema.parse(formData);

    // Insert into database
    const { error: insertError } = await supabase
      .from("missing_pets")
      .insert({
        nombre: validatedData.nombre,
        especie: validatedData.especie,
        raza: validatedData.raza || null,
        color: validatedData.color,
        descripcion_fisica: validatedData.descripcionFisica || null,
        foto_url: fotoUrl,
        zona_extravio: validatedData.zonaExtravio,
        dueño_nombre: validatedData.dueñoNombre,
        dueño_telefono: validatedData.dueñoTelefono,
        reportado_por: user.id,
      });

    if (insertError) {
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
