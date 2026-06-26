import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/missing-person/SearchBar";
import { HelpZoneSearchResults } from "@/components/help-zone/HelpZoneSearchResults";
import { Package } from "lucide-react";

export const metadata = {
  title: "Zonas que Necesitan Ayuda - Vzla Al Rescate",
};

export default async function ZonasPage({
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
                Zonas que Necesitan Ayuda
              </h1>
              <p className="text-gray-800 font-semibold">
                Consulta qué sectores necesitan insumos urgentes. Coordina la entrega de
                ayuda humanitaria directamente con los responsables de cada zona.
              </p>
            </div>
            <Link
              href="/reportar-zona"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-[15px] shadow-sm flex-shrink-0"
            >
              <Package className="w-4 h-4" />
              Reportar
            </Link>
          </div>

          <Suspense fallback={<div className="h-12 bg-gray-200 rounded-lg animate-pulse" />}>
            <div className="mb-8">
              <SearchBar placeholder="Busca por zona, insumos o descripción..." />
            </div>
          </Suspense>

          <Suspense fallback={<SearchResultsLoading />}>
            <HelpZoneSearchResults searchParams={Promise.resolve(params)} />
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
      <p className="mt-4 text-gray-600">Buscando zonas...</p>
    </div>
  );
}
