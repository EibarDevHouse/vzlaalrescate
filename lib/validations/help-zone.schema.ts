import { z } from "zod";
import { INSUMOS_OPTIONS } from "@/lib/constants";

// Schema para react-hook-form (sin insumos ni foto)
export const helpZoneFormSchema = z.object({
  zona: z
    .string()
    .trim()
    .min(3, "Ingresa el nombre de la zona (mínimo 3 caracteres)"),
  descripcion: z
    .string()
    .trim()
    .optional()
    .nullable(),
  responsableNombre: z
    .string()
    .trim()
    .min(3, "Ingresa el nombre del responsable (mínimo 3 caracteres)"),
  responsableTelefono: z
    .string()
    .trim()
    .regex(/^\+?\d{7,15}$/, "Teléfono inválido"),
});

export type HelpZoneFormValues = z.infer<typeof helpZoneFormSchema>;

// Schema completo para server-side validation
export const helpZoneServerSchema = helpZoneFormSchema.extend({
  insumosNecesarios: z
    .array(z.enum(INSUMOS_OPTIONS))
    .min(1, "Selecciona al menos un insumo"),
});
