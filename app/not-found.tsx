import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Página no encontrada - Vzla Al Rescate",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-xl font-bold text-gray-900 mb-6">
            La página que buscas no existe
          </p>
          <p className="text-gray-800 font-medium mb-8">
            Tal vez se movió o no está disponible. Vuelve al inicio.
          </p>
          <Link href="/">
            <Button size="lg">Ir al inicio</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
