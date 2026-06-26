"use client";

import { MapPin, Phone, User, PawPrint } from "lucide-react";

interface MissingPet {
  id: string;
  nombre: string;
  especie: string;
  raza: string | null;
  color: string;
  descripcion_fisica: string | null;
  foto_url: string;
  zona_extravio: string;
  dueño_nombre: string;
  dueño_telefono: string;
  estado: string;
  created_at: string;
}

interface MissingPetCardProps {
  pet: MissingPet;
}

export function MissingPetCard({ pet }: MissingPetCardProps) {
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "encontrado":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "encontrado":
        return "Encontrado";
      default:
        return "Desaparecido";
    }
  };

  const getEspecieEmoji = (especie: string) => {
    switch (especie) {
      case "perro":
        return "🐕";
      case "gato":
        return "🐈";
      default:
        return "🐾";
    }
  };

  return (
    <div className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all">
      <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-amber-100 to-orange-50 overflow-hidden">
        <img
          src={pet.foto_url}
          alt={pet.nombre}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(
            pet.estado
          )}`}
        >
          {getEstadoLabel(pet.estado)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{getEspecieEmoji(pet.especie)}</span>
          <h3 className="text-lg font-semibold text-gray-900">{pet.nombre}</h3>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">
            {pet.especie.charAt(0).toUpperCase() + pet.especie.slice(1)}
          </span>
          {pet.raza && ` · ${pet.raza}`}
        </p>

        {/* Color and description */}
        <div className="space-y-1 mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Color:</span>{" "}
            {pet.color.charAt(0).toUpperCase() + pet.color.slice(1)}
          </p>
          {pet.descripcion_fisica && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {pet.descripcion_fisica}
            </p>
          )}
        </div>

        {/* Location and owner */}
        <div className="space-y-2 border-t border-gray-200 pt-3">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
            <span className="line-clamp-2">{pet.zona_extravio}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <User className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
            <span>{pet.dueño_nombre}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-amber-600" />
            <a
              href={`tel:${pet.dueño_telefono}`}
              className="text-sm font-bold text-amber-600 hover:text-amber-800 underline"
            >
              {pet.dueño_telefono}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
