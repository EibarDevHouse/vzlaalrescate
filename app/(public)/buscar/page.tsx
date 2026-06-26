import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/missing-person/SearchBar";
import { SearchResults } from "@/components/missing-person/SearchResults";
import { SearchPageClient } from "./page-client";

export const metadata = {
  title: "Buscar Desaparecidos - Vzla Al Rescate",
};

export default async function BuscarPage({
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
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">Buscar Desaparecidos</h1>
            <p className="text-gray-800 font-semibold">
              Busca entre todos los reportes disponibles. Usa el nombre, cédula o una
              descripción para encontrar a la persona que buscas.
            </p>
          </div>

          <Suspense fallback={<div className="h-12 bg-gray-200 rounded-lg animate-pulse" />}>
            <div className="mb-8">
              <SearchBar />
            </div>
          </Suspense>

          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block flex-shrink-0 w-[220px]">
              <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <SearchPageClient isDesktop />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Mobile filter button */}
              <div className="lg:hidden mb-6">
                <SearchPageClient />
              </div>

              {/* Results */}
              <Suspense fallback={<SearchResultsLoading />}>
                <SearchResults searchParams={Promise.resolve(params)} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function SearchResultsLoading() {
  return (
    <div className="text-center py-8">
      <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">Buscando...</p>
    </div>
  );
}
