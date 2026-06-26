import { z } from "zod";
import { ESPECIE_OPTIONS, COLOR_MASCOTA } from "@/lib/constants";

export const missingPetFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Ingresa el nombre de la mascota"),
  especie: z.enum(ESPECIE_OPTIONS),
  raza: z
    .string()
    .trim()
    .optional()
    .nullable(),
  color: z.enum(COLOR_MASCOTA),
  descripcionFisica: z
    .string()
    .trim()
    .optional()
    .nullable(),
  zonaExtravio: z
    .string()
    .trim()
    .min(3, "Ingresa la zona de extravío"),
  dueñoNombre: z
    .string()
    .trim()
    .min(3, "Ingresa el nombre del dueño (mínimo 3 caracteres)"),
  dueñoTelefono: z
    .string()
    .trim()
    .regex(/^\+?\d{7,15}$/, "Teléfono inválido"),
});

export type MissingPetFormValues = z.infer<typeof missingPetFormSchema>;

export const missingPetServerSchema = missingPetFormSchema;
