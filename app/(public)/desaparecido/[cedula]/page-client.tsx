"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AccessRequestModal } from "@/components/missing-person/AccessRequestModal";
import { MissingPerson } from "@/types/missing-person";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DetailPageClientProps {
  person: MissingPerson;
}

export function DetailPageClient({ person }: DetailPageClientProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [key, setKey] = useState(0);

  const isCreator = user?.id === person.reportado_por;

  const handleSuccess = () => {
    // Refresh key to reload data
    setKey((k) => k + 1);
  };

  return (
    <>
      {/* Contact Section */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Si tienes información sobre esta persona
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Reportante:</p>
            <p className="font-bold text-blue-900 text-base">
              {person.reportante_nombre}
            </p>
            <p className="text-sm text-blue-900 font-medium">
              ({person.reportante_relacion})
            </p>
          </div>
          <a
            href={`tel:${person.reportante_telefono}`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg inline-block"
          >
            📞 {person.reportante_telefono}
          </a>

          {/* Botón para solicitar acceso si no eres el creador */}
          {!isCreator && user && (
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="secondary"
              className="w-full"
            >
              Solicitar Acceso para Agregar Información
            </Button>
          )}

          {/* Mensaje si no estás autenticado */}
          {!user && (
            <p className="text-sm text-blue-700 italic">
              Inicia sesión para solicitar acceso y agregar información a este reporte
            </p>
          )}

          <p className="text-sm text-blue-700">
            Llama directamente al reportante. Si crees que la información es
            falsa, comunícalo a las autoridades.
          </p>
        </div>
      </div>

      {/* Access Request Modal */}
      <AccessRequestModal
        key={key}
        cedula={person.cedula}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
