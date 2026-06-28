import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { MissingPerson } from "@/types/missing-person";
import { MapPin, Calendar } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { DetailPageClient } from "./page-client";
import { ShareButtons } from "@/components/missing-person/ShareButtons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cedula: string }>;
}) {
  const { cedula } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("missing_persons")
    .select("nombre_completo")
    .eq("cedula", cedula)
    .single();

  return {
    title: data
      ? `${data.nombre_completo} - Vzla Al Rescate`
      : "Desaparecido - Vzla Al Rescate",
  };
}

export default async function DesaparecidoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ cedula: string }>;
  searchParams: Promise<{ reportado?: string }>;
}) {
  const { cedula } = await params;
  const { reportado } = await searchParams;
  const supabase = await createClient();

  const { data: person, error } = await supabase
    .from("missing_persons")
    .select("*")
    .eq("cedula", cedula)
    .single();

  if (error || !person) {
    notFound();
  }

  const mPerson = person as MissingPerson;
  const createdDate = new Date(mPerson.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "encontrado_vivo":
        return "Encontrado (Vivo)";
      case "encontrado_fallecido":
        return "Encontrado (Fallecido)";
      default:
        return "Desaparecido";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "encontrado_vivo":
        return "text-green-700 bg-green-50";
      case "encontrado_fallecido":
        return "text-gray-700 bg-gray-50";
      default:
        return "text-red-700 bg-red-50";
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow px-4 py-6 sm:py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {reportado && (
            <Alert variant="success" className="mb-6">
              ¡Reporte creado exitosamente! Comparte este enlace con otros para
              aumentar la visibilidad.
            </Alert>
          )}

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Image Section */}
            <div className="relative w-full h-96 bg-gray-200 overflow-hidden">
              <img
                src={mPerson.foto_url}
                alt={mPerson.nombre_completo}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8">
              {/* Header with name and status */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {mPerson.nombre_completo}
                    </h1>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      {(mPerson as any).tiene_cedula === false ? "Sin cédula de identidad" : mPerson.cedula}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg font-semibold text-sm ${getEstadoColor(
                      mPerson.estado
                    )}`}
                  >
                    {getEstadoLabel(mPerson.estado)}
                  </div>
                </div>
              </div>

              {/* Basic Info Grid */}
              <div className="grid sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Última Ubicación Conocida
                  </h3>
                  <p className="text-gray-800 font-medium">{mPerson.ultima_ubicacion}</p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Reportado
                  </h3>
                  <p className="text-gray-800 font-medium">{createdDate}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Descripción Física</h3>
                <p className="text-gray-800 font-medium whitespace-pre-wrap">
                  {mPerson.descripcion_fisica}
                </p>
              </div>

              {/* Physical Characteristics */}
              {(mPerson.edad_aprox ||
                mPerson.genero ||
                mPerson.color_piel ||
                mPerson.color_cabello ||
                mPerson.color_ojos ||
                mPerson.usa_lentes ||
                mPerson.estatura_cm ||
                mPerson.peso_kg) && (
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Características Físicas
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {mPerson.edad_aprox && (
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Edad</p>
                        <p className="font-medium text-gray-900">{mPerson.edad_aprox} años</p>
                      </div>
                    )}
                    {mPerson.genero && (
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Género</p>
                        <p className="font-medium capitalize text-gray-900">{mPerson.genero}</p>
                      </div>
                    )}
                    {mPerson.color_piel && (
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Color de Piel</p>
                        <p className="font-medium capitalize text-gray-900">{mPerson.color_piel}</p>
                      </div>
                    )}
                    {mPerson.color_cabello && (
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Color de Cabello</p>
                        <p className="font-medium capitalize text-gray-900">
                          {mPerson.color_cabello}
                        </p>
                      </div>
                    )}
                    {mPerson.color_ojos && (
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Color de Ojos</p>
                        <p className="font-medium capitalize text-gray-900">{mPerson.color_ojos}</p>
                      </div>
                    )}
                    {mPerson.usa_lentes !== null && (
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Lentes</p>
                        <p className="font-medium text-gray-900">
                          {mPerson.usa_lentes ? "Sí" : "No"}
                        </p>
                      </div>
                    )}
                    {mPerson.estatura_cm && (
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Estatura</p>
                        <p className="font-medium text-gray-900">{mPerson.estatura_cm} cm</p>
                      </div>
                    )}
                    {mPerson.peso_kg && (
                      <div>
                        <p className="text-sm text-gray-800 font-semibold">Peso</p>
                        <p className="font-medium text-gray-900">{mPerson.peso_kg} kg</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info and Access Requests */}
              <DetailPageClient person={mPerson} />

              {/* Share Section */}
              <ShareButtons name={mPerson.nombre_completo} cedula={mPerson.cedula} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
