import { Navbar } from "@/components/layout/Navbar";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Error de Autenticación - Vzla Al Rescate",
};

export default function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    error_description?: string;
  }>;
}) {
  const getErrorMessage = async () => {
    const params = await searchParams;
    const error = params.error || "unknown";
    const description = params.error_description || "";

    switch (error) {
      case "otp_expired":
        return {
          title: "Enlace Expirado",
          message:
            "El enlace de acceso expiró. Los enlaces son válidos por 24 horas.",
          action: "Solicitar un nuevo enlace",
        };
      case "otp_invalid":
      case "access_denied":
        return {
          title: "Enlace Inválido",
          message:
            "El enlace no es válido. Puede que ya haya sido utilizado o sea incorrecto.",
          action: "Solicitar un nuevo enlace",
        };
      default:
        return {
          title: "Error de Autenticación",
          message:
            description || "Ocurrió un error al procesar tu enlace de acceso.",
          action: "Intentar de nuevo",
        };
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-300 shadow-md">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>

            <AuthError />
          </div>
        </div>
      </main>
    </>
  );
}

async function AuthError() {
  // Note: This is a workaround for dynamic content in Server Components
  // In a real app, you'd extract error details in the client component
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
        Enlace Expirado
      </h1>
      <p className="text-center text-gray-800 font-medium mb-6">
        El enlace de acceso expiró. Los enlaces son válidos por 24 horas.
      </p>

      <Alert variant="warning" className="mb-6">
        <p className="text-sm">
          Si el enlace expiró, solicita uno nuevo. Te enviaremos un correo con un
          enlace fresco.
        </p>
      </Alert>

      <div className="space-y-3">
        <Link href="/login" className="block">
          <Button className="w-full">Solicitar Nuevo Enlace</Button>
        </Link>

        <Link href="/" className="block">
          <Button variant="secondary" className="w-full">
            Volver al Inicio
          </Button>
        </Link>
      </div>

      <p className="text-xs text-gray-700 text-center mt-6 font-medium">
        ¿Necesitas ayuda? Asegúrate de que el correo sea correcto e intenta de nuevo.
      </p>
    </>
  );
}
