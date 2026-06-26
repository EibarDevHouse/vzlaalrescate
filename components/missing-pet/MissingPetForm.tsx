"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { missingPetFormSchema, type MissingPetFormValues } from "@/lib/validations/missing-pet.schema";
import { createMissingPet } from "@/app/reportar-mascota/actions";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PhotoUploader } from "@/components/missing-person/PhotoUploader";
import { ESPECIE_OPTIONS, RAZA_PERRO, RAZA_GATO, COLOR_MASCOTA } from "@/lib/constants";

interface MissingPetFormProps {
  onSuccess?: (id: string) => void;
}

export function MissingPetForm({ onSuccess }: MissingPetFormProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedEspecie, setSelectedEspecie] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MissingPetFormValues>({
    resolver: zodResolver(missingPetFormSchema),
  });

  const especieValue = watch("especie");

  const getRazaOptions = () => {
    if (especieValue === "perro") {
      return RAZA_PERRO.map((r) => ({ value: r, label: r }));
    }
    if (especieValue === "gato") {
      return RAZA_GATO.map((r) => ({ value: r, label: r }));
    }
    return [];
  };

  const onSubmit = async (formData: MissingPetFormValues) => {
    console.log("📋 Formulario enviado:", { formData, selectedPhoto });

    if (!selectedPhoto) {
      console.warn("⚠️ Sin foto seleccionada");
      setError("Debes seleccionar una foto");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      console.log("🚀 Iniciando creación de mascota...");

      // Upload photo to Supabase Storage
      const fileName = `mascotas/${Date.now()}-${selectedPhoto.name}`;
      const { error: uploadError } = await supabase.storage
        .from("missing-persons-photos")
        .upload(fileName, selectedPhoto);

      if (uploadError) {
        console.error("❌ Error al subir foto:", uploadError.message);
        setError("Error al subir la foto: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("missing-persons-photos")
        .getPublicUrl(fileName);

      const fotoUrl = data.publicUrl;

      // Create missing pet record
      const result = await createMissingPet(formData, fotoUrl);

      console.log("📡 Respuesta del servidor:", result);

      if (result.success) {
        console.log("✅ Mascota reportada exitosamente");
        reset();
        setSelectedPhoto(null);
        router.push("/mascotas?reportado=true");
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

      {/* Section 1: Pet Info */}
      <fieldset className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Información de la Mascota</h3>

        <Input
          label="Nombre de la Mascota *"
          placeholder="Ej: Max, Mimi, Rocky"
          {...register("nombre")}
          error={errors.nombre?.message}
        />

        <Select
          label="Especie *"
          placeholder="Selecciona..."
          options={ESPECIE_OPTIONS.map((e) => ({
            value: e,
            label: e.charAt(0).toUpperCase() + e.slice(1),
          }))}
          {...register("especie")}
          error={errors.especie?.message}
        />

        {(especieValue === "perro" || especieValue === "gato") && (
          <Select
            label="Raza"
            placeholder="Selecciona..."
            options={getRazaOptions()}
            {...register("raza")}
            error={errors.raza?.message}
          />
        )}

        <Select
          label="Color Principal *"
          placeholder="Selecciona..."
          options={COLOR_MASCOTA.map((c) => ({
            value: c,
            label: c.charAt(0).toUpperCase() + c.slice(1),
          }))}
          {...register("color")}
          error={errors.color?.message}
        />

        <TextArea
          label="Descripción Física Adicional"
          placeholder="Marcas distintivas, tamaño, características especiales, etc. (opcional)"
          rows={3}
          {...register("descripcionFisica")}
          error={errors.descripcionFisica?.message}
        />

        <Input
          label="Zona de Extravío *"
          placeholder="Dirección, barrio, zona, etc."
          {...register("zonaExtravio")}
          error={errors.zonaExtravio?.message}
        />
      </fieldset>

      {/* Section 2: Photo */}
      <fieldset>
        <PhotoUploader
          label="Foto de la Mascota"
          isRequired={true}
          onPhotoSelect={setSelectedPhoto}
        />
      </fieldset>

      {/* Section 3: Owner Info */}
      <fieldset className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Información del Dueño</h3>

        <Input
          label="Nombre del Dueño *"
          placeholder="Tu nombre completo"
          {...register("dueñoNombre")}
          error={errors.dueñoNombre?.message}
        />

        <Input
          label="Teléfono del Dueño *"
          type="tel"
          placeholder="+58 xxx xxxxxxx"
          {...register("dueñoTelefono")}
          error={errors.dueñoTelefono?.message}
          hint="Para que quien encuentre a tu mascota pueda contactarte"
        />
      </fieldset>

      <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
        Publicar Reporte de Mascota
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al publicar confirmas que la información es precisa y que tienes autoridad para reportar esta mascota
      </p>
    </form>
  );
}
