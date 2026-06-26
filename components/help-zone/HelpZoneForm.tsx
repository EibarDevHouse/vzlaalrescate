"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { helpZoneFormSchema, type HelpZoneFormValues } from "@/lib/validations/help-zone.schema";
import { createHelpZone } from "@/app/reportar-zona/actions";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PhotoUploader } from "@/components/missing-person/PhotoUploader";
import { INSUMOS_OPTIONS } from "@/lib/constants";

interface HelpZoneFormProps {
  onSuccess?: (id: string) => void;
}

export function HelpZoneForm({ onSuccess }: HelpZoneFormProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedInsumos, setSelectedInsumos] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HelpZoneFormValues>({
    resolver: zodResolver(helpZoneFormSchema),
  });

  const handleInsumoToggle = (insumo: string) => {
    const newInsumos = new Set(selectedInsumos);
    if (newInsumos.has(insumo)) {
      newInsumos.delete(insumo);
    } else {
      newInsumos.add(insumo);
    }
    setSelectedInsumos(newInsumos);
  };

  const onSubmit = async (formData: HelpZoneFormValues) => {
    console.log("📋 Formulario enviado:", { formData, selectedInsumos: Array.from(selectedInsumos), selectedPhoto });

    if (selectedInsumos.size === 0) {
      console.warn("⚠️ Sin insumos seleccionados");
      setError("Debes seleccionar al menos un insumo");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      console.log("🚀 Iniciando creación de zona...");
      let fotoUrl: string | undefined;

      // Upload photo if selected
      if (selectedPhoto) {
        const fileName = `zonas/${Date.now()}-${selectedPhoto.name}`;
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

        fotoUrl = data.publicUrl;
      }

      // Create help zone record
      const result = await createHelpZone(
        {
          ...formData,
          insumosNecesarios: Array.from(selectedInsumos) as any,
        },
        fotoUrl
      );

      console.log("📡 Respuesta del servidor:", result);

      if (result.success) {
        console.log("✅ Zona creada exitosamente");
        reset();
        setSelectedPhoto(null);
        setSelectedInsumos(new Set());
        router.push("/zonas?reportado=true");
      } else {
        console.error("❌ Error en servidor:", result.message);
        setError(result.message || "Error al crear el reporte");
      }
    } catch (err) {
      console.error("💥 Error inesperado:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      {/* Section 1: Zone Info */}
      <fieldset className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Información de la Zona</h3>

        <Input
          label="Nombre o Ubicación de la Zona *"
          placeholder="Ej: Barrio Los Andes, Sector Catia"
          {...register("zona")}
          error={errors.zona?.message}
        />

        <TextArea
          label="Descripción Adicional"
          placeholder="Detalles sobre la situación, condiciones especiales, etc. (opcional)"
          rows={4}
          {...register("descripcion")}
          error={errors.descripcion?.message}
        />
      </fieldset>

      {/* Section 2: Supplies */}
      <fieldset className="space-y-4">
        <label className="block font-bold text-lg text-gray-900">
          Insumos Necesarios *
        </label>
        <div className="space-y-3">
          {INSUMOS_OPTIONS.map((insumo) => (
            <label key={insumo} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedInsumos.has(insumo)}
                onChange={() => handleInsumoToggle(insumo)}
                className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-900 font-medium">
                {insumo.charAt(0).toUpperCase() + insumo.slice(1)}
              </span>
            </label>
          ))}
        </div>
        {selectedInsumos.size === 0 && (
          <p className="text-sm text-red-600 font-medium">
            Selecciona al menos un insumo
          </p>
        )}
      </fieldset>

      {/* Section 3: Photo */}
      <fieldset>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600">
            Una foto puede ayudar a coordinar mejor la entrega de insumos
          </p>
        </div>
        <PhotoUploader
          label="Foto de la Zona"
          isRequired={false}
          onPhotoSelect={setSelectedPhoto}
        />
      </fieldset>

      {/* Section 4: Coordinator Info */}
      <fieldset className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Información del Responsable</h3>

        <Input
          label="Nombre del Responsable *"
          placeholder="Nombre completo"
          {...register("responsableNombre")}
          error={errors.responsableNombre?.message}
        />

        <Input
          label="Teléfono del Responsable *"
          type="tel"
          placeholder="+58 xxx xxxxxxx"
          {...register("responsableTelefono")}
          error={errors.responsableTelefono?.message}
          hint="Para que se comuniquen con ustedes"
        />
      </fieldset>

      <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
        Publicar Zona que Necesita Ayuda
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al publicar confirmas que la información es precisa y que tienes autoridad para reportar esta zona
      </p>
    </form>
  );
}
