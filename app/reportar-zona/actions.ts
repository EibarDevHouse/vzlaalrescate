"use server";

import { createClient } from "@/lib/supabase/server";
import { helpZoneServerSchema } from "@/lib/validations/help-zone.schema";
import { z } from "zod";

export type CreateHelpZoneResult =
  | { success: true }
  | {
      success: false;
      errorType: "VALIDATION_ERROR" | "UNKNOWN";
      message?: string;
    };

export async function createHelpZone(
  formData: z.infer<typeof helpZoneServerSchema>,
  fotoUrl?: string
): Promise<CreateHelpZoneResult> {
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
    const validatedData = helpZoneServerSchema.parse(formData);

    // Insert into database
    const { error: insertError } = await supabase
      .from("help_zones")
      .insert({
        zona: validatedData.zona,
        insumos_necesarios: validatedData.insumosNecesarios,
        descripcion: validatedData.descripcion || null,
        foto_url: fotoUrl || null,
        responsable_nombre: validatedData.responsableNombre,
        responsable_telefono: validatedData.responsableTelefono,
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
