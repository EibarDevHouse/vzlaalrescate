import { z } from "zod";
import { normalizeCedula } from "@/lib/utils/cedula";
import {
  GENERO_OPTIONS,
  COLOR_PIEL_OPTIONS,
  COLOR_CABELLO_OPTIONS,
  COLOR_OJOS_OPTIONS,
  RELACION_OPTIONS,
} from "@/lib/constants";

export const cedulaSchema = z
  .string()
  .trim()
  .transform(normalizeCedula)
  .pipe(
    z.string().regex(/^[VE]-\d{7,8}$/, {
      message: "Formato inválido. Usa V-12345678 o E-12345678",
    })
  );

export const missingPersonFormSchema = z.object({
  cedula: cedulaSchema,
  nombreCompleto: z
    .string()
    .trim()
    .min(3, "Ingresa el nombre completo (mínimo 3 caracteres)"),
  descripcionFisica: z
    .string()
    .trim()
    .min(10, "Describe con más detalle (mínimo 10 caracteres)"),
  ultimaUbicacion: z
    .string()
    .trim()
    .min(3, "Ingresa la última ubicación conocida"),
  foto: z
    .instanceof(File, { message: "La foto es obligatoria" })
    .refine((f) => f.size <= 5 * 1024 * 1024, "La foto no debe superar 5MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Formato de imagen no soportado (JPEG, PNG o WebP)"
    ),

  // Optional physical characteristics
  edadAprox: z
    .number()
    .int()
    .min(0, "La edad debe ser mayor a 0")
    .max(120, "La edad debe ser menor a 120")
    .optional()
    .nullable(),
  genero: z.enum(GENERO_OPTIONS).optional().nullable(),
  colorPiel: z.enum(COLOR_PIEL_OPTIONS).optional().nullable(),
  colorCabello: z.enum(COLOR_CABELLO_OPTIONS).optional().nullable(),
  colorOjos: z.enum(COLOR_OJOS_OPTIONS).optional().nullable(),
  usaLentes: z.boolean().optional().nullable(),
  estaturaCm: z
    .number()
    .int()
    .min(30, "La estatura debe ser mayor a 30 cm")
    .max(250, "La estatura debe ser menor a 250 cm")
    .optional()
    .nullable(),
  pesoCm: z
    .number()
    .int()
    .min(1, "El peso debe ser mayor a 1 kg")
    .max(300, "El peso debe ser menor a 300 kg")
    .optional()
    .nullable(),

  // Reporter info
  reportanteNombre: z
    .string()
    .trim()
    .min(3, "Ingresa tu nombre (mínimo 3 caracteres)"),
  reportanteTelefono: z
    .string()
    .trim()
    .regex(/^\+?\d{7,15}$/, "Teléfono inválido"),
  reportanteRelacion: z.enum(RELACION_OPTIONS, {
    message: "Selecciona una relación válida",
  }),
});

export type MissingPersonFormValues = z.infer<typeof missingPersonFormSchema>;
