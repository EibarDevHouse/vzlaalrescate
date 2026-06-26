"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { approveAccessRequest, rejectAccessRequest } from "@/app/admin/actions";

interface MyReport {
  id: string;
  type: "persona" | "mascota" | "zona";
  titulo: string;
  subtitulo?: string;
  estado: string;
  created_at: string;
  pending_requests_count?: number;
  cedula?: string; // para personas
  nombre?: string; // para mascotas
  zona?: string; // para zonas
}

interface AccessRequest {
  id: string;
  cedula: string;
  solicitante_id: string;
  mensaje: string;
  estado: string;
  created_at: string;
  solicitante_name?: string;
  solicitante_phone?: string;
  solicitante_email?: string;
}

interface MySentRequest {
  id: string;
  cedula: string;
  mensaje: string;
  estado: string;
  created_at: string;
  report_name?: string;
}

export default function PerfilPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"mis_reportes" | "mis_solicitudes">("mis_reportes");
  const [myReports, setMyReports] = useState<MyReport[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Record<string, AccessRequest[]>>({});
  const [sentRequests, setSentRequests] = useState<MySentRequest[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedReports, setExpandedReports] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && !isLoading) {
      loadData();
    }
  }, [user, isLoading]);

  const loadData = async () => {
    if (!user) return;

    const allReports: MyReport[] = [];

    // Load personas reports
    const { data: personas } = await supabase
      .from("missing_persons")
      .select("cedula, nombre_completo, estado, created_at")
      .eq("reportado_por", user.id)
      .order("created_at", { ascending: false });

    if (personas) {
      personas.forEach((p: any) => {
        allReports.push({
          id: p.cedula,
          type: "persona",
          titulo: p.nombre_completo,
          subtitulo: p.cedula,
          estado: p.estado,
          created_at: p.created_at,
          cedula: p.cedula,
        });
      });

      // Load pending requests for personas
      const requestsMap: Record<string, AccessRequest[]> = {};
      for (const report of personas) {
        const { data: requests } = await supabase
          .from("access_requests")
          .select("*")
          .eq("cedula", report.cedula)
          .eq("estado", "pendiente")
          .order("created_at", { ascending: false });

        if (requests && requests.length > 0) {
          requestsMap[report.cedula] = requests as AccessRequest[];
        }
      }
      setPendingRequests(requestsMap);
    }

    // Load mascotas reports
    const { data: mascotas } = await supabase
      .from("missing_pets")
      .select("id, nombre, especie, estado, created_at")
      .eq("reportado_por", user.id)
      .order("created_at", { ascending: false });

    if (mascotas) {
      mascotas.forEach((m: any) => {
        allReports.push({
          id: m.id,
          type: "mascota",
          titulo: m.nombre,
          subtitulo: m.especie.charAt(0).toUpperCase() + m.especie.slice(1),
          estado: m.estado,
          created_at: m.created_at,
          nombre: m.nombre,
        });
      });
    }

    // Load zonas reports
    const { data: zonas } = await supabase
      .from("help_zones")
      .select("id, zona, insumos_necesarios, estado, created_at")
      .eq("reportado_por", user.id)
      .order("created_at", { ascending: false });

    if (zonas) {
      zonas.forEach((z: any) => {
        allReports.push({
          id: z.id,
          type: "zona",
          titulo: z.zona,
          subtitulo: z.insumos_necesarios.slice(0, 2).join(", "),
          estado: z.estado,
          created_at: z.created_at,
          zona: z.zona,
        });
      });
    }

    // Sort all reports by creation date
    allReports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setMyReports(allReports);

    // Load my sent requests
    const { data: sent } = await supabase
      .from("access_requests")
      .select("*")
      .eq("solicitante_id", user.id)
      .order("created_at", { ascending: false });

    if (sent) {
      // Fetch report names
      const requestsWithNames = await Promise.all(
        (sent as MySentRequest[]).map(async (req) => {
          const { data: reportData } = await supabase
            .from("missing_persons")
            .select("nombre_completo")
            .eq("cedula", req.cedula)
            .single();
          return { ...req, report_name: reportData?.nombre_completo };
        })
      );
      setSentRequests(requestsWithNames);
    }
  };

  const handleApprove = async (cedula: string, solicitanteId: string) => {
    setLoadingId(`${cedula}-${solicitanteId}`);
    const result = await approveAccessRequest(cedula, solicitanteId);

    if (result.success) {
      // Remove from pending requests
      setPendingRequests((prev) => ({
        ...prev,
        [cedula]: (prev[cedula] || []).filter(
          (r) => r.solicitante_id !== solicitanteId
        ),
      }));
    } else {
      alert("Error: " + result.error);
    }
    setLoadingId(null);
  };

  const handleReject = async (cedula: string, solicitanteId: string) => {
    setLoadingId(`${cedula}-${solicitanteId}`);
    const result = await rejectAccessRequest(cedula, solicitanteId);

    if (result.success) {
      // Remove from pending requests
      setPendingRequests((prev) => ({
        ...prev,
        [cedula]: (prev[cedula] || []).filter(
          (r) => r.solicitante_id !== solicitanteId
        ),
      }));
    } else {
      alert("Error: " + result.error);
    }
    setLoadingId(null);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </main>
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow px-4 py-6 sm:py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
            <p className="text-gray-800 font-semibold">
              Gestiona tus reportes y solicitudes de acceso
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("mis_reportes")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "mis_reportes"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Mis Reportes ({myReports.length})
            </button>
            <button
              onClick={() => setActiveTab("mis_solicitudes")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "mis_solicitudes"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Mis Solicitudes ({sentRequests.length})
            </button>
          </div>

          {/* Tab: Mis Reportes */}
          {activeTab === "mis_reportes" && (
            <div className="space-y-4">
              {myReports.length === 0 ? (
                <Alert variant="info">
                  No has creado ningún reporte.
                  <a href="/reportar" className="font-bold underline ml-2">
                    Crear reporte
                  </a>
                </Alert>
              ) : (
                myReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              {report.type === "persona" && "Persona"}
                              {report.type === "mascota" && "Mascota"}
                              {report.type === "zona" && "Zona"}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              report.estado === "desaparecido" ? "bg-red-100 text-red-700" :
                              report.estado === "encontrado" ? "bg-green-100 text-green-700" :
                              report.estado === "activa" ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {report.estado.charAt(0).toUpperCase() + report.estado.slice(1)}
                            </span>
                          </div>
                          <p className="text-xl font-bold text-gray-900">
                            {report.titulo}
                          </p>
                          {report.subtitulo && (
                            <p className="text-sm text-gray-600 mt-1">
                              {report.subtitulo}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            Creado el{" "}
                            {new Date(report.created_at).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                        <a
                          href={
                            report.type === "persona" ? `/desaparecido/${report.cedula}` :
                            report.type === "mascota" ? `/mascotas` :
                            `/zonas`
                          }
                          className="text-blue-600 hover:text-blue-700 font-semibold underline text-sm"
                        >
                          Ver →
                        </a>
                      </div>

                      {/* Solicitudes pendientes - solo para personas */}
                      {report.type === "persona" && report.cedula && (pendingRequests[report.cedula] || []).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-semibold text-orange-700 bg-orange-50 inline-block px-3 py-1 rounded-full">
                            {(pendingRequests[report.cedula] || []).length} solicitud
                            {(pendingRequests[report.cedula] || []).length !== 1
                              ? "es"
                              : ""}{" "}
                            pendiente
                            {(pendingRequests[report.cedula] || []).length !== 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Expanded: Solicitudes pendientes - solo para personas */}
                    {report.type === "persona" && report.cedula && expandedReports.has(report.cedula) &&
                      (pendingRequests[report.cedula] || []).length > 0 && (
                        <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
                          <h4 className="font-bold text-gray-900 mb-4">
                            Solicitudes Pendientes
                          </h4>
                          {(pendingRequests[report.cedula] || []).map(
                            (request) => (
                              <div
                                key={request.id}
                                className="bg-white p-4 rounded-lg border border-gray-200"
                              >
                                <p className="text-sm text-gray-600 font-semibold mb-2">
                                  Solicitante
                                </p>
                                <p className="text-gray-800 font-mono text-sm truncate mb-3">
                                  {request.solicitante_id}
                                </p>

                                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                                  <p className="text-sm text-blue-900 font-semibold mb-1">
                                    Mensaje
                                  </p>
                                  <p className="text-blue-800 text-sm">
                                    {request.mensaje}
                                  </p>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    onClick={() =>
                                      handleApprove(report.cedula!, request.solicitante_id)
                                    }
                                    disabled={
                                      loadingId ===
                                      `${report.cedula}-${request.solicitante_id}`
                                    }
                                    className="flex-1 flex items-center justify-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      handleReject(report.cedula!, request.solicitante_id)
                                    }
                                    disabled={
                                      loadingId ===
                                      `${report.cedula}-${request.solicitante_id}`
                                    }
                                    className="flex-1 flex items-center justify-center gap-2"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Rechazar
                                  </Button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab: Mis Solicitudes */}
          {activeTab === "mis_solicitudes" && (
            <div className="space-y-4">
              {sentRequests.length === 0 ? (
                <Alert variant="info">
                  No has enviado ninguna solicitud de acceso
                </Alert>
              ) : (
                sentRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`bg-white border rounded-lg p-6 shadow-sm ${
                      request.estado === "pendiente"
                        ? "border-orange-300 border-l-4 border-l-orange-500"
                        : request.estado === "aprobada"
                          ? "border-green-300 border-l-4 border-l-green-500"
                          : "border-red-300 border-l-4 border-l-red-500"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">
                          Reporte
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {request.report_name || "Cargando..."}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Cédula: {request.cedula}
                        </p>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          request.estado === "pendiente"
                            ? "bg-orange-100 text-orange-800"
                            : request.estado === "aprobada"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.estado === "pendiente" && (
                          <>
                            <Clock className="w-4 h-4" />
                            Pendiente
                          </>
                        )}
                        {request.estado === "aprobada" && (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Aprobada
                          </>
                        )}
                        {request.estado === "rechazada" && (
                          <>
                            <XCircle className="w-4 h-4" />
                            Rechazada
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 font-semibold mb-1">
                        Tu mensaje
                      </p>
                      <p className="text-gray-800">{request.mensaje}</p>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <p>
                        Solicitado el{" "}
                        {new Date(request.created_at).toLocaleDateString("es-ES")}
                      </p>
                      {request.estado === "aprobada" && (
                        <a
                          href={`/desaparecido/${request.cedula}`}
                          className="text-blue-600 hover:text-blue-700 font-semibold underline"
                        >
                          Ver Reporte →
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
