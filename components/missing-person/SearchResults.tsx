import { createClient } from "@/lib/supabase/server";
import { MissingPerson } from "@/types/missing-person";
import { MissingPersonCard } from "./MissingPersonCard";
import { AlertCircle } from "lucide-react";

interface SearchResultsProps {
  searchParams: Promise<{
    q?: string;
    genero?: string;
    colorPiel?: string;
    colorCabello?: string;
    colorOjos?: string;
    usaLentes?: string;
    edadMin?: string;
    edadMax?: string;
    estaturaMin?: string;
    estaturaMax?: string;
    pesoMin?: string;
    pesoMax?: string;
  }>;
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  const params = await searchParams;
  const query = params.q || "";

  const supabase = await createClient();

  let query_obj = supabase.from("missing_persons").select("*");

  // Apply text search
  if (query.trim()) {
    query_obj = query_obj.or(
      `nombre_completo.ilike.%${query}%,cedula.ilike.%${query}%,descripcion_fisica.ilike.%${query}%,ultima_ubicacion.ilike.%${query}%`
    );
  }

  // Apply filters
  if (params.genero) {
    query_obj = query_obj.eq("genero", params.genero);
  }

  if (params.colorPiel) {
    query_obj = query_obj.eq("color_piel", params.colorPiel);
  }

  if (params.colorCabello) {
    query_obj = query_obj.eq("color_cabello", params.colorCabello);
  }

  if (params.colorOjos) {
    query_obj = query_obj.eq("color_ojos", params.colorOjos);
  }

  if (params.usaLentes) {
    const usaLentes = params.usaLentes === "true";
    query_obj = query_obj.eq("usa_lentes", usaLentes);
  }

  if (params.edadMin) {
    query_obj = query_obj.gte("edad_aprox", parseInt(params.edadMin));
  }

  if (params.edadMax) {
    query_obj = query_obj.lte("edad_aprox", parseInt(params.edadMax));
  }

  if (params.estaturaMin) {
    query_obj = query_obj.gte("estatura_cm", parseInt(params.estaturaMin));
  }

  if (params.estaturaMax) {
    query_obj = query_obj.lte("estatura_cm", parseInt(params.estaturaMax));
  }

  if (params.pesoMin) {
    query_obj = query_obj.gte("peso_kg", parseInt(params.pesoMin));
  }

  if (params.pesoMax) {
    query_obj = query_obj.lte("peso_kg", parseInt(params.pesoMax));
  }

  // Filter by status (only missing people)
  query_obj = query_obj.eq("estado", "desaparecido");

  // Order and limit
  query_obj = query_obj.order("created_at", { ascending: false }).limit(50);

  const { data, error } = await query_obj;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-red-900">Error en la búsqueda</h3>
          <p className="text-sm text-red-800 mt-1">
            Ocurrió un error al buscar. Por favor, intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {query ? "No se encontraron resultados" : "Aún no hay reportes"}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {query
            ? `No encontramos coincidencias para "${query}". Intenta con otros términos.`
            : "Esperamos que todos estén seguros. Cuando se reporte un desaparecido aparecerá aquí."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        Se encontraron <strong>{data.length}</strong> resultado{data.length === 1 ? "" : "s"}
        {query && ` para "${query}"`}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((person) => (
          <MissingPersonCard key={person.cedula} person={person} />
        ))}
      </div>
    </div>
  );
}
