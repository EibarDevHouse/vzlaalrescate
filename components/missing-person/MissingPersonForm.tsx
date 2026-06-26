"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { missingPersonFormSchema, type MissingPersonFormValues } from "@/lib/validations/missing-person.schema";
import { createMissingPerson } from "@/app/reportar/actions";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PhotoUploader } from "./PhotoUploader";
import {
  GENERO_OPTIONS,
  COLOR_PIEL_OPTIONS,
  COLOR_CABELLO_OPTIONS,
  COLOR_OJOS_OPTIONS,
  RELACION_OPTIONS,
} from "@/lib/constants";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MissingPersonFormProps {
  onSuccess?: (cedula: string) => void;
}

export function MissingPersonForm({ onSuccess }: MissingPersonFormProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateError, setDuplicateError] = useState<{
    cedula: string;
  } | null>(null);
  const [expandPhysical, setExpandPhysical] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MissingPersonFormValues>({
    resolver: zodResolver(missingPersonFormSchema),
  });

  const onSubmit = async (formData: MissingPersonFormValues) => {
    if (!selectedPhoto) {
      setError("Debes seleccionar una foto");
      return;
    }

    setError(null);
    setDuplicateError(null);
    setIsSubmitting(true);

    try {
      // Upload photo to Supabase Storage
      const fileName = `${Date.now()}-${selectedPhoto.name}`;
      const { error: uploadError } = await supabase.storage
        .from("missing-persons-photos")
        .upload(fileName, selectedPhoto);

      if (uploadError) {
        setError("Error al subir la foto: " + uploadError.message);
        return;
      }

      // Get public URL
      const { data } = supabase.storage
        .from("missing-persons-photos")
        .getPublicUrl(fileName);

      const fotoUrl = data.publicUrl;

      // Create missing person record
      const result = await createMissingPerson(formData, fotoUrl);

      if (result.success) {
        reset();
        setSelectedPhoto(null);
        onSuccess?.(formData.cedula);
        router.push(`/desaparecido/${formData.cedula}?reportado=true`);
      } else if (result.errorType === "DUPLICATE_CEDULA") {
        setDuplicateError({ cedula: result.cedula || "" });
      } else {
        setError(result.message || "Error al crear el reporte");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (duplicateError) {
    return (
      <Alert variant="warning">
        <p className="mb-4">
          Ya existe un reporte con la cédula <strong>{duplicateError.cedula}</strong>.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/desaparecido/${duplicateError.cedula}`)}
          >
            Ver el reporte existente
          </Button>
          <p className="text-sm text-gray-600">
            Si tienes información adicional sobre esta persona, por favor contacta
            directamente al reportante usando el teléfono que aparece en el reporte.
          </p>
        </div>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      {/* Section 1: Basic Info */}
      <fieldset className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Información del Desaparecido</h3>

        <Input
          label="Cédula de Identidad *"
          placeholder="V-12345678 o E-12345678"
          {...register("cedula")}
          error={errors.cedula?.message}
          hint="Formato: V-XXXXXXXX o E-XXXXXXXX"
        />

        <Input
          label="Nombre Completo *"
          placeholder="Nombre y apellidos"
          {...register("nombreCompleto")}
          error={errors.nombreCompleto?.message}
        />

        <TextArea
          label="Descripción Física *"
          placeholder="Altura, peso, color de cabello, marcas distintivas, etc."
          rows={4}
          {...register("descripcionFisica")}
          error={errors.descripcionFisica?.message}
        />

        <Input
          label="Última Ubicación Conocida *"
          placeholder="Dirección, zona, ciudad, etc."
          {...register("ultimaUbicacion")}
          error={errors.ultimaUbicacion?.message}
        />
      </fieldset>

      {/* Section 2: Photo */}
      <fieldset>
        <PhotoUploader onPhotoSelect={setSelectedPhoto} error={errors.foto?.message} />
      </fieldset>

      {/* Section 3: Optional Physical Characteristics */}
      <fieldset>
        <button
          type="button"
          onClick={() => setExpandPhysical(!expandPhysical)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg font-bold text-gray-900 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
        >
          <span>Características Físicas (Opcional)</span>
          {expandPhysical ? (
            <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
          )}
        </button>

        {expandPhysical && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4 grid sm:grid-cols-2 gap-4">
            <Input
              label="Edad Aproximada"
              type="number"
              placeholder="Ej: 25"
              {...register("edadAprox", { valueAsNumber: true })}
              error={errors.edadAprox?.message}
            />

            <Select
              label="Género"
              placeholder="Selecciona..."
              options={GENERO_OPTIONS.map((g) => ({
                value: g,
                label: g.charAt(0).toUpperCase() + g.slice(1),
              }))}
              {...register("genero")}
              error={errors.genero?.message}
            />

            <Select
              label="Color de Piel"
              placeholder="Selecciona..."
              options={COLOR_PIEL_OPTIONS.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
              }))}
              {...register("colorPiel")}
              error={errors.colorPiel?.message}
            />

            <Select
              label="Color de Cabello"
              placeholder="Selecciona..."
              options={COLOR_CABELLO_OPTIONS.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
              }))}
              {...register("colorCabello")}
              error={errors.colorCabello?.message}
            />

            <Select
              label="Color de Ojos"
              placeholder="Selecciona..."
              options={COLOR_OJOS_OPTIONS.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
              }))}
              {...register("colorOjos")}
              error={errors.colorOjos?.message}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                ¿Usa Lentes?
              </label>
              <select
                {...register("usaLentes")}
                className="w-full px-4 py-2.5 border border-gray-400 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="" className="text-gray-900">Selecciona...</option>
                <option value="true" className="text-gray-900 bg-white">Sí</option>
                <option value="false" className="text-gray-900 bg-white">No</option>
              </select>
            </div>

            <Input
              label="Estatura (cm)"
              type="number"
              placeholder="Ej: 170"
              {...register("estaturaCm", { valueAsNumber: true })}
              error={errors.estaturaCm?.message}
            />

            <Input
              label="Peso (kg)"
              type="number"
              placeholder="Ej: 70"
              {...register("pesoCm", { valueAsNumber: true })}
              error={errors.pesoCm?.message}
            />
          </div>
        )}
      </fieldset>

      {/* Section 4: Reporter Info */}
      <fieldset className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Tu Información (Reportante)</h3>

        <Input
          label="Tu Nombre *"
          placeholder="Tu nombre completo"
          {...register("reportanteNombre")}
          error={errors.reportanteNombre?.message}
        />

        <Input
          label="Tu Teléfono *"
          type="tel"
          placeholder="+58 xxx xxxxxxx"
          {...register("reportanteTelefono")}
          error={errors.reportanteTelefono?.message}
          hint="Para que los familiares puedan contactarte"
        />

        <Select
          label="Tu Relación con el Desaparecido *"
          placeholder="Selecciona..."
          options={RELACION_OPTIONS.map((r) => ({
            value: r,
            label: r.charAt(0).toUpperCase() + r.slice(1),
          }))}
          {...register("reportanteRelacion")}
          error={errors.reportanteRelacion?.message}
        />
      </fieldset>

      <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
        Publicar Reporte
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al publicar confirmas que la información es precisa y que tienes derecho a compartirla
      </p>
    </form>
  );
}
