import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/missing-person/SearchBar";
import { MissingPetSearchResults } from "@/components/missing-pet/MissingPetSearchResults";
import { PawPrint } from "lucide-react";

export const metadata = {
  title: "Mascotas Desaparecidas - Vzla Al Rescate",
};

export default async function MascotasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-grow px-4 py-6 sm:py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
                Mascotas Desaparecidas
              </h1>
              <p className="text-gray-800 font-semibold">
                Busca mascotas perdidas en las emergencias. Ayuda a reunirlas con sus familias
                compartiendo información que encuentres.
              </p>
            </div>
            <Link
              href="/reportar-mascota"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all text-[15px] shadow-sm flex-shrink-0"
            >
              <PawPrint className="w-4 h-4" />
              Reportar
            </Link>
          </div>

          <Suspense fallback={<div className="h-12 bg-gray-200 rounded-lg animate-pulse" />}>
            <div className="mb-8">
              <SearchBar placeholder="Busca por nombre, especie, raza o zona..." />
            </div>
          </Suspense>

          <Suspense fallback={<SearchResultsLoading />}>
            <MissingPetSearchResults searchParams={Promise.resolve(params)} />
          </Suspense>
        </div>
      </main>
    </>
  );
}

function SearchResultsLoading() {
  return (
    <div className="text-center py-8">
      <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Buscando mascotas...</p>
    </div>
  );
}
