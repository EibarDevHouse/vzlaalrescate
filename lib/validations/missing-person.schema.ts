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

export const missingPersonFormSchema = z
  .object({
    cedula: z.string().optional().nullable(),
    sinCedula: z.boolean().optional(),
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
    foto: z.any().optional(),

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
    usaLentes: z.enum(["true", "false", ""]).optional(),
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
  })
  .superRefine((data, ctx) => {
    // If not reporting without cedula, cedula is required and must be valid format
    if (!data.sinCedula) {
      if (!data.cedula || !data.cedula.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cedula"],
          message: "La cédula es requerida",
        });
      } else {
        // Validate cedula format
        const normalized = data.cedula.trim().toUpperCase().replace(/[\s.]/g, "");
        const cedulaRegex = /^[VE]-\d{7,8}$/;
        if (!cedulaRegex.test(normalized)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["cedula"],
            message: "Formato inválido. Usa V-12345678 o E-12345678",
          });
        }
      }
    }

    // If reporting without cedula, age is required and must be <= 17
    if (data.sinCedula) {
      if (data.edadAprox === undefined || data.edadAprox === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["edadAprox"],
          message: "La edad es requerida para reportes sin cédula",
        });
      } else if (data.edadAprox > 17) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["edadAprox"],
          message: "Esta opción es solo para reportar niños y niñas menores de edad (máximo 17 años)",
        });
      }
    }
  });

export type MissingPersonFormValues = z.infer<typeof missingPersonFormSchema>;

// For server action: includes optional forceInsert flag to bypass duplicate detection
export const createMissingPersonInputSchema = missingPersonFormSchema.extend({
  forceInsert: z.boolean().optional(),
});
export type CreateMissingPersonInput = z.infer<typeof createMissingPersonInputSchema>;
