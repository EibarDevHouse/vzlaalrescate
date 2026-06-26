import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Heart, Search, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:py-20">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Heart className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Vzla Al Rescate
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 font-semibold mb-8 max-w-2xl mx-auto">
              Conectando a familias. Ayudando en la emergencia. Cada búsqueda cuenta.
            </p>
            <p className="text-base sm:text-lg text-gray-700 mb-10 max-w-2xl mx-auto font-medium">
              Plataforma para reportar y buscar personas desaparecidas tras emergencias
              en Venezuela.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/buscar" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="w-5 h-5" />
                  Buscar Desaparecidos
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <Plus className="w-5 h-5" />
                  Reportar Desaparecido
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 px-4 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Busca Libremente</h3>
                <p className="text-gray-800 font-medium">
                  Accede sin registrarte a la base de datos de desaparecidos
                </p>
              </div>
              <div className="text-center">
                <Plus className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Reporta Rápido</h3>
                <p className="text-gray-800 font-medium">
                  Crea un reporte con una foto para conectar con familiares
                </p>
              </div>
              <div className="text-center">
                <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Conexión Humana</h3>
                <p className="text-gray-800 font-medium">
                  Ayudamos a reunir a las personas con sus seres queridos
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Notice */}
        <section className="py-8 px-4 bg-yellow-50 border-y border-yellow-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-3 items-start">
              <AlertCircle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900">En Caso de Emergencia</h3>
                <p className="text-yellow-800 mt-1">
                  Si tienes información sobre un desaparecido, llama a las autoridades
                  locales o contacta directamente al familia usando el teléfono que aparece
                  en cada reporte.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p className="mb-2">Vzla Al Rescate © 2026</p>
          <p className="text-gray-400">
            Hecho con ❤️ para ayudar a encontrar a nuestros seres queridos
          </p>
        </div>
      </footer>
    </>
  );
}
