"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

interface DuplicateMatch {
  cedula: string;
  nombre_completo: string;
  ultima_ubicacion: string;
  tiene_cedula: boolean;
}

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
  const [possibleDuplicates, setPossibleDuplicates] = useState<DuplicateMatch[] | null>(null);
  const [expandPhysical, setExpandPhysical] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<MissingPersonFormValues>({
    resolver: zodResolver(missingPersonFormSchema),
  });

  const sinCedula = watch("sinCedula");

  useEffect(() => {
    const preloadSinCedula = searchParams.get("sinCedula") === "true";
    if (preloadSinCedula) {
      setValue("sinCedula", true);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (formData: MissingPersonFormValues, skipDuplicateCheck: boolean = false) => {
    if (!selectedPhoto) {
      setError("Debes seleccionar una foto");
      return;
    }

    setError(null);
    setDuplicateError(null);
    setPossibleDuplicates(null);
    setIsSubmitting(true);

    try {
      const fileName = `${Date.now()}-${selectedPhoto.name}`;
      const { error: uploadError } = await supabase.storage
        .from("missing-persons-photos")
        .upload(fileName, selectedPhoto);

      if (uploadError) {
        setError("Error al subir la foto: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("missing-persons-photos")
        .getPublicUrl(fileName);

      const fotoUrl = data.publicUrl;

      const result = await createMissingPerson(formData, fotoUrl, skipDuplicateCheck);

      if (result.success) {
        reset();
        setSelectedPhoto(null);
        onSuccess?.(result.cedula);
        router.push(`/desaparecido/${result.cedula}?reportado=true`);
      } else if (result.errorType === "DUPLICATE_CEDULA") {
        setDuplicateError({ cedula: result.cedula || "" });
      } else if (result.errorType === "POSSIBLE_DUPLICATE" && result.matches) {
        setPossibleDuplicates(result.matches);
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

  if (possibleDuplicates) {
    return (
      <Alert variant="warning">
        <p className="mb-4 font-semibold">
          ⚠️ Encontramos reportes con nombres similares. ¿Confirmas que es una persona distinta?
        </p>
        <div className="space-y-3 mb-4">
          {possibleDuplicates.map((match) => (
            <div key={match.cedula} className="p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{match.nombre_completo}</p>
                  <p className="text-sm text-gray-600">
                    {match.tiene_cedula ? `Cédula: ${match.cedula}` : "Sin cédula"}
                  </p>
                  <p className="text-sm text-gray-600">Ubicación: {match.ultima_ubicacion}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(`/desaparecido/${match.cedula}`)}
                >
                  Ver
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSubmit((data) => onSubmit(data, true))}
            isLoading={isSubmitting}
          >
            Es una persona distinta, continuar
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPossibleDuplicates(null)}
          >
            Cancelar
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      {/* Section 0: Without Cedula Toggle */}
      <fieldset className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("sinCedula")}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-600"
            />
            <span className="font-semibold text-gray-900">
              Es un niño/niña que no tiene cédula de identidad
            </span>
          </label>
          <p className="text-sm text-gray-700 mt-2">
            Esta opción es exclusiva para reportar menores de edad sin cédula. Los reportes se revisan para evitar duplicados.
          </p>
        </div>
      </fieldset>

      {/* Section 1: Basic Info */}
      <fieldset className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Información del Desaparecido</h3>

        {!sinCedula && (
          <Input
            label="Cédula de Identidad *"
            placeholder="V-12345678 o E-12345678"
            {...register("cedula")}
            error={errors.cedula?.message}
            hint="Formato: V-XXXXXXXX o E-XXXXXXXX"
          />
        )}

        {sinCedula && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            ✓ Se generará un identificador interno para el caso
          </div>
        )}

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
        <PhotoUploader onPhotoSelect={setSelectedPhoto} error={errors.foto?.message as string | undefined} />
      </fieldset>

      {/* Section 2.5: Age (required when reporting without cedula) */}
      {sinCedula && (
        <fieldset className="space-y-2">
          <Input
            label="Edad Aproximada *"
            type="number"
            placeholder="Ej: 12 (máximo 17 años)"
            min="0"
            max="17"
            {...register("edadAprox", { valueAsNumber: true })}
            error={errors.edadAprox?.message}
            hint="Máximo 17 años"
          />
        </fieldset>
      )}

      {/* Section 3: Optional Physical Characteristics */}
      <fieldset>
        <button
          type="button"
          onClick={() => setExpandPhysical(!expandPhysical)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg font-bold text-gray-900 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
        >
          <span>{sinCedula ? "Características Físicas (Opcional)" : "Características Físicas (Opcional)"}</span>
          {expandPhysical ? (
            <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-600 flex-shrink-0" />
          )}
        </button>

        {expandPhysical && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4 grid sm:grid-cols-2 gap-4">
            {!sinCedula && (
              <Input
                label="Edad Aproximada"
                type="number"
                placeholder="Ej: 25"
                {...register("edadAprox", { valueAsNumber: true })}
                error={errors.edadAprox?.message}
              />
            )}

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
