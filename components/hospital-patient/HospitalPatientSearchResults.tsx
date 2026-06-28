import { createClient } from "@/lib/supabase/server";
import { HospitalPatient } from "@/types/hospital-patient";
import { HospitalPatientCard } from "./HospitalPatientCard";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface HospitalPatientSearchResultsProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 12;

export async function HospitalPatientSearchResults({
  searchParams,
}: HospitalPatientSearchResultsProps) {
  const params = await searchParams;
  const query = params.q || "";
  const page = Math.max(1, parseInt(params.page || "1"));
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const supabase = await createClient();

  let query_obj = supabase.from("hospital_patients").select("*", { count: "exact" });

  // Apply text search with flexible matching (case-insensitive substring)
  if (query.trim()) {
    query_obj = query_obj.or(
      `nombre_completo.ilike.%${query}%,cedula.ilike.%${query}%,hospital.ilike.%${query}%`
    );
  }

  // Order by creation date descending, pagination
  const { data: patients, error, count } = await query_obj
    .order("created_at", { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 font-semibold">Error al cargar los pacientes</p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 font-semibold">
          {query.trim()
            ? "No se encontraron pacientes con esos criterios"
            : "No hay pacientes registrados aún"}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);
  const queryString = query ? `&q=${encodeURIComponent(query)}` : "";

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {patients.map((patient) => (
          <HospitalPatientCard key={patient.id} patient={patient as HospitalPatient} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{offset + 1}</span> a{" "}
            <span className="font-semibold">
              {Math.min(offset + ITEMS_PER_PAGE, count || 0)}
            </span>{" "}
            de <span className="font-semibold">{count}</span> pacientes
          </p>

          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/pacientes?page=${page - 1}${queryString}`}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Link>
            )}

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/pacientes?page=${p}${queryString}`}
                  className={`px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            {page < totalPages && (
              <Link
                href={`/pacientes?page=${page + 1}${queryString}`}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
