"use client";

import { useState } from "react";
import { createAccessRequest } from "@/app/actions/access-requests";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Alert } from "@/components/ui/Alert";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AccessRequestModalProps {
  cedula: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AccessRequestModal({
  cedula,
  isOpen,
  onClose,
  onSuccess,
}: AccessRequestModalProps) {
  const { user } = useAuth();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!nombre.trim()) {
      setError("Por favor, ingresa tu nombre");
      setIsLoading(false);
      return;
    }

    if (!telefono.trim()) {
      setError("Por favor, ingresa tu teléfono de contacto");
      setIsLoading(false);
      return;
    }

    if (!mensaje.trim()) {
      setError("Por favor, escribe un mensaje explicando por qué necesitas acceso");
      setIsLoading(false);
      return;
    }

    if (!user?.email) {
      setError("Error: No se encontró tu correo electrónico");
      setIsLoading(false);
      return;
    }

    const result = await createAccessRequest(cedula, nombre.trim(), telefono.trim(), user.email, mensaje.trim());

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setNombre("");
        setTelefono("");
        setMensaje("");
        setSuccess(false);
        onSuccess();
        onClose();
      }, 2000);
    } else {
      setError(result.error || "Error desconocido");
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Solicitar Acceso
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-800 font-semibold mb-4">
            Explica por qué necesitas acceso a este reporte. El creador revisará
            tu solicitud y podrá aprobarla.
          </p>

          {success ? (
            <Alert variant="success">
              ✅ Solicitud enviada correctamente. El creador del reporte revisará
              tu solicitud pronto.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <Alert variant="error">{error}</Alert>}

              <Input
                label="Tu nombre"
                placeholder="Ej: María García"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isLoading}
              />

              <Input
                label="Teléfono de contacto"
                placeholder="Ej: +58 412 1234567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                disabled={isLoading}
              />

              <TextArea
                label="Tu mensaje"
                placeholder="Ej: Soy su hermana y quiero agregar información sobre cicatrices o medicinas"
                rows={3}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                disabled={isLoading}
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Enviar Solicitud
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
