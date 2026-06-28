import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SearchBar } from "@/components/missing-person/SearchBar";
import { HospitalPatientSearchResults } from "@/components/hospital-patient/HospitalPatientSearchResults";

export const metadata = {
  title: "Pacientes en Hospitales - Vzla Al Rescate",
};

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-grow px-4 py-6 sm:py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
              Pacientes en Hospitales
            </h1>
            <p className="text-gray-800 font-semibold">
              Consulta el estado de pacientes en distintos centros y hospitales.
              Busca por nombre, cédula u hospital para encontrar la información
              que necesitas.
            </p>
          </div>

          <Suspense fallback={<div className="h-12 bg-gray-200 rounded-lg animate-pulse" />}>
            <div className="mb-8">
              <SearchBar placeholder="Busca por nombre, cédula u hospital..." />
            </div>
          </Suspense>

          <Suspense fallback={<SearchResultsLoading />}>
            <HospitalPatientSearchResults searchParams={Promise.resolve(params)} />
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
      <p className="mt-4 text-gray-600">Buscando pacientes...</p>
    </div>
  );
}
