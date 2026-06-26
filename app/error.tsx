"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
          <p className="text-gray-800 font-semibold mb-2">
            Ocurrió un error inesperado. Por favor, intenta de nuevo.
          </p>
          {error.message && (
            <p className="text-sm text-gray-900 mb-6 font-mono bg-gray-100 p-3 rounded">
              {error.message}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={reset}>Intentar de nuevo</Button>
            <Link
              href="/"
              className="px-4 py-2 text-base font-semibold rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors inline-flex items-center justify-center"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
