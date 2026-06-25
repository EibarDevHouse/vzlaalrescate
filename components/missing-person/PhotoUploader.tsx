"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

interface PhotoUploaderProps {
  onPhotoSelect: (file: File) => void;
  error?: string;
}

export function PhotoUploader({ onPhotoSelect, error }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      setLocalError("La foto no debe superar 5MB");
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      setLocalError("Formato de imagen no soportado (JPEG, PNG o WebP)");
      return false;
    }

    setLocalError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onPhotoSelect(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Foto del Desaparecido *
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
            aria-label="Eliminar foto"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Foto seleccionada: <strong>{fileName}</strong>
          </p>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">
            Arrastra una foto aquí o haz clic
          </p>
          <p className="text-xs text-gray-500 mt-1">JPEG, PNG o WebP (máx. 5MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Seleccionar foto"
      />

      {(error || localError) && (
        <Alert variant="error">{error || localError}</Alert>
      )}
    </div>
  );
}
