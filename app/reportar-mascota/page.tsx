"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { MissingPetForm } from "@/components/missing-pet/MissingPetForm";
import { useAuth } from "@/hooks/useAuth";

export default function ReportarMascotaPage() {
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
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Reportar Mascota Desaparecida</h1>
            <p className="text-gray-800 font-semibold">
              Ayuda a tu mascota a regresar a casa. Completa el formulario con toda la
              información que tengas: foto, características, zona y tu teléfono de contacto.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
            <MissingPetForm />
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">🐾 Consejos útiles</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Usa una foto clara y reciente de tu mascota</li>
              <li>• Especifica características únicas (cicatrices, marcas, collar)</li>
              <li>• Sé preciso con la zona donde fue visto por última vez</li>
              <li>• Asegúrate de que tu teléfono sea fácil de contactar</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
