"use client";

import { HospitalPatient } from "@/types/hospital-patient";
import { MapPin, User, Stethoscope } from "lucide-react";

interface HospitalPatientCardProps {
  patient: HospitalPatient;
}

export function HospitalPatientCard({ patient }: HospitalPatientCardProps) {
  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "dado_de_alta":
        return "bg-green-100 text-green-800";
      case "fallecido":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "dado_de_alta":
        return "Dado de Alta";
      case "fallecido":
        return "Fallecido";
      default:
        return "Hospitalizado";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        {/* Header with name and status badge */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {patient.nombre_completo}
          </h3>
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getEstadoBadgeColor(
              patient.estado
            )}`}
          >
            {getEstadoLabel(patient.estado)}
          </div>
        </div>

        {/* Patient info */}
        <div className="space-y-2 mb-4">
          <div className="flex gap-4">
            {patient.edad && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Edad:</span> {patient.edad} años
              </p>
            )}
            {patient.sexo && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Sexo:</span>{" "}
                {patient.sexo.charAt(0).toUpperCase() + patient.sexo.slice(1)}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-700">
            <span className="font-medium">Identificación:</span>{" "}
            {patient.cedula ? patient.cedula : "Sin cédula registrada"}
          </p>

          <div className="flex items-start gap-2 text-sm text-gray-700">
            <Stethoscope className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
            <span className="font-medium flex-1">{patient.hospital}</span>
          </div>

          {patient.doctor_a_cargo && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Doctor:</span> {patient.doctor_a_cargo}
            </p>
          )}

          {patient.procedencia && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Procedencia:</span> {patient.procedencia}
            </p>
          )}
        </div>

        {/* Registered date */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Registrado:{" "}
            {new Date(patient.created_at).toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>
    </div>
  );
}
