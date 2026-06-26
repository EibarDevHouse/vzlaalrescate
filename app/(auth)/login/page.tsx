"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/reportar");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50">
          <div className="text-center">
            <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </main>
      </>
    );
  }

  if (user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-300 shadow-md">
            <h1 className="text-3xl font-bold text-center mb-3 text-gray-900">
              Iniciar Sesión
            </h1>
            <p className="text-center text-gray-700 mb-6 font-medium">
              Ingresa tu correo para reportar desaparecidos
            </p>
            <LoginForm />
          </div>
        </div>
      </main>
    </>
  );
}
