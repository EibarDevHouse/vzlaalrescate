"use client";

import { MapPin, Phone, User } from "lucide-react";

interface HelpZone {
  id: string;
  zona: string;
  insumos_necesarios: string[];
  descripcion: string | null;
  foto_url: string | null;
  responsable_nombre: string;
  responsable_telefono: string;
  estado: string;
  created_at: string;
}

interface HelpZoneCardProps {
  zone: HelpZone;
}

export function HelpZoneCard({ zone }: HelpZoneCardProps) {
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "atendida":
        return "bg-green-100 text-green-800";
      case "cerrada":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "atendida":
        return "Atendida";
      case "cerrada":
        return "Cerrada";
      default:
        return "Activa";
    }
  };

  return (
    <div className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all">
      {/* Image or placeholder */}
      <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden flex items-center justify-center">
        {zone.foto_url ? (
          <img
            src={zone.foto_url}
            alt={zone.zona}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-blue-400">
            <MapPin className="w-16 h-16 mx-auto opacity-50" />
          </div>
        )}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(
            zone.estado
          )}`}
        >
          {getEstadoLabel(zone.estado)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {zone.zona}
        </h3>

        {/* Supplies chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {zone.insumos_necesarios.slice(0, 3).map((insumo) => (
            <span
              key={insumo}
              className="px-2 py-1 bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700 rounded-full"
            >
              {insumo.charAt(0).toUpperCase() + insumo.slice(1)}
            </span>
          ))}
          {zone.insumos_necesarios.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 rounded-full">
              +{zone.insumos_necesarios.length - 3} más
            </span>
          )}
        </div>

        {/* Description preview */}
        {zone.descripcion && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {zone.descripcion}
          </p>
        )}

        {/* Coordinator info */}
        <div className="space-y-2 border-t border-gray-200 pt-3">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <User className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
            <span>{zone.responsable_nombre}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <a
              href={`tel:${zone.responsable_telefono}`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {zone.responsable_telefono}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
