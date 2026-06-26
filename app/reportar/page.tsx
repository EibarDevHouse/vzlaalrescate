"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { MissingPersonForm } from "@/components/missing-person/MissingPersonForm";
import { useAuth } from "@/hooks/useAuth";

export default function ReportarPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow px-4 py-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Reportar Desaparecido</h1>
            <p className="text-gray-800 font-semibold">
              Completa el formulario con toda la información que tengas. Todos los datos
              son importantes para encontrar a la persona.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
            <MissingPersonForm />
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">📞 Necesitas ayuda?</h3>
            <p className="text-sm text-blue-800">
              Si tienes dudas al completar el formulario, puedes contactar a través de los
              canales oficiales de emergencia en tu zona.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
