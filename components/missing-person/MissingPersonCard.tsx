"use client";

import { useRouter } from "next/navigation";
import { MissingPerson } from "@/types/missing-person";
import { MapPin, Phone, User } from "lucide-react";

interface MissingPersonCardProps {
  person: MissingPerson;
}

export function MissingPersonCard({ person }: MissingPersonCardProps) {
  const router = useRouter();
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "encontrado_vivo":
        return "bg-green-100 text-green-800";
      case "encontrado_fallecido":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "encontrado_vivo":
        return "Encontrado (Vivo)";
      case "encontrado_fallecido":
        return "Encontrado (Fallecido)";
      default:
        return "Desaparecido";
    }
  };

  return (
    <div
      onClick={() => router.push(`/desaparecido/${person.cedula}`)}
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
    >
      <div>
        {/* Image */}
        <div className="relative w-full h-48 sm:h-56 bg-gray-200 overflow-hidden">
          <img
            src={person.foto_url}
            alt={person.nombre_completo}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(
              person.estado
            )}`}
          >
            {getEstadoLabel(person.estado)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {person.nombre_completo}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {(person as any).tiene_cedula === false ? "Sin cédula de identidad" : person.cedula}
          </p>

          {/* Physical characteristics preview */}
          <div className="space-y-2 mb-3">
            {person.edad_aprox && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Edad:</span> {person.edad_aprox} años
              </p>
            )}
            {person.genero && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Género:</span>{" "}
                {person.genero.charAt(0).toUpperCase() + person.genero.slice(1)}
              </p>
            )}
            {person.color_piel && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Color de piel:</span>{" "}
                {person.color_piel.charAt(0).toUpperCase() + person.color_piel.slice(1)}
              </p>
            )}
          </div>

          {/* Location and contact */}
          <div className="space-y-2 border-t border-gray-200 pt-3">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
              <span className="line-clamp-2">{person.ultima_ubicacion}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <User className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
              <span>
                {person.reportante_nombre} <br />
                <span className="text-xs text-gray-500">
                  ({person.reportante_relacion})
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {person.reportante_telefono}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
