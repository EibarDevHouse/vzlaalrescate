"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { approveAccessRequest, rejectAccessRequest, getPendingChildReports, markChildReportReviewed } from "./actions";

interface AccessRequest {
  id: string;
  cedula: string;
  solicitante_id: string;
  mensaje: string;
  estado: string;
  created_at: string;
}

interface AbuseReport {
  id: string;
  cedula: string;
  denunciante_id: string;
  motivo: string;
  estado: string;
  created_at: string;
}

interface ChildReport {
  cedula: string;
  nombre_completo: string;
  ultima_ubicacion: string;
  edad_aprox: number | null;
  created_at: string;
  reportante_nombre: string;
  reportante_telefono: string;
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"solicitudes" | "denuncias" | "sin-cedula">("solicitudes");
  const [solicitudes, setSolicitudes] = useState<AccessRequest[]>([]);
  const [denuncias, setDenuncias] = useState<AbuseReport[]>([]);
  const [childReports, setChildReports] = useState<ChildReport[]>([]);
  const [loadingSolicitudesId, setLoadingSolicitudesId] = useState<string | null>(null);
  const [loadingDenunciasId, setLoadingDenunciasId] = useState<string | null>(null);
  const [loadingChildId, setLoadingChildId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!data) {
        router.push("/");
        return;
      }

      setIsAdmin(true);
      loadData();
    };

    if (user && !isLoading) {
      checkAdmin();
    }
  }, [user, isLoading]);

  const loadData = async () => {
    // Load access requests
    const { data: solicitudesData } = await supabase
      .from("access_requests")
      .select("*")
      .eq("estado", "pendiente")
      .order("created_at", { ascending: false });

    if (solicitudesData) {
      setSolicitudes(solicitudesData);
    }

    // Load abuse reports
    const { data: denunciasData } = await supabase
      .from("abuse_reports")
      .select("*")
      .eq("estado", "pendiente")
      .order("created_at", { ascending: false });

    if (denunciasData) {
      setDenuncias(denunciasData);
    }

    // Load child reports pending review
    const result = await getPendingChildReports();
    if (result.success && result.data) {
      setChildReports(result.data);
    }
  };

  const handleApprove = async (cedula: string, solicitanteId: string) => {
    setLoadingSolicitudesId(`${cedula}-${solicitanteId}`);
    const result = await approveAccessRequest(cedula, solicitanteId);

    if (result.success) {
      setSolicitudes(
        solicitudes.filter(
          (s) => !(s.cedula === cedula && s.solicitante_id === solicitanteId)
        )
      );
    } else {
      alert("Error: " + result.error);
    }
    setLoadingSolicitudesId(null);
  };

  const handleReject = async (cedula: string, solicitanteId: string) => {
    setLoadingSolicitudesId(`${cedula}-${solicitanteId}`);
    const result = await rejectAccessRequest(cedula, solicitanteId);

    if (result.success) {
      setSolicitudes(
        solicitudes.filter(
          (s) => !(s.cedula === cedula && s.solicitante_id === solicitanteId)
        )
      );
    } else {
      alert("Error: " + result.error);
    }
    setLoadingSolicitudesId(null);
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

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow px-4 py-6 sm:py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Admin</h1>
            <p className="text-gray-800 font-semibold">
              Gestiona solicitudes de acceso y reportes de abuso
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setActiveTab("solicitudes")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "solicitudes"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Solicitudes de Acceso ({solicitudes.length})
            </button>
            <button
              onClick={() => setActiveTab("denuncias")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "denuncias"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Reportes de Abuso ({denuncias.length})
            </button>
            <button
              onClick={() => setActiveTab("sin-cedula")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "sin-cedula"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Sin Cédula por Revisar ({childReports.length})
            </button>
          </div>

          {/* Solicitudes Tab */}
          {activeTab === "solicitudes" && (
            <div className="space-y-4">
              {solicitudes.length === 0 ? (
                <Alert variant="info">No hay solicitudes pendientes</Alert>
              ) : (
                solicitudes.map((solicitud) => (
                  <div
                    key={solicitud.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                  >
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Cédula</p>
                        <p className="text-lg font-bold text-gray-900">
                          {solicitud.cedula}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Usuario ID</p>
                        <p className="text-sm font-mono text-gray-700 truncate">
                          {solicitud.solicitante_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Fecha</p>
                        <p className="text-sm text-gray-700">
                          {new Date(solicitud.created_at).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 font-semibold mb-1">Mensaje</p>
                      <p className="text-gray-800">{solicitud.mensaje}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleApprove(solicitud.cedula, solicitud.solicitante_id)
                        }
                        disabled={
                          loadingSolicitudesId ===
                          `${solicitud.cedula}-${solicitud.solicitante_id}`
                        }
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Aprobar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleReject(solicitud.cedula, solicitud.solicitante_id)
                        }
                        disabled={
                          loadingSolicitudesId ===
                          `${solicitud.cedula}-${solicitud.solicitante_id}`
                        }
                        className="flex items-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Denuncias Tab */}
          {activeTab === "denuncias" && (
            <div className="space-y-4">
              {denuncias.length === 0 ? (
                <Alert variant="info">No hay reportes de abuso pendientes</Alert>
              ) : (
                denuncias.map((denuncia) => (
                  <div
                    key={denuncia.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm border-l-4 border-l-red-500"
                  >
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Cédula</p>
                        <p className="text-lg font-bold text-gray-900">
                          {denuncia.cedula}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Denunciante</p>
                        <p className="text-sm font-mono text-gray-700 truncate">
                          {denuncia.denunciante_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Fecha</p>
                        <p className="text-sm text-gray-700">
                          {new Date(denuncia.created_at).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-red-900 font-semibold mb-1">Motivo</p>
                      <p className="text-red-800">{denuncia.motivo}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary">Ver Reporte</Button>
                      <Button variant="danger">Revisar</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sin Cédula Tab */}
          {activeTab === "sin-cedula" && (
            <div className="space-y-4">
              {childReports.length === 0 ? (
                <Alert variant="info">No hay reportes sin cédula pendientes de revisar</Alert>
              ) : (
                childReports.map((report) => (
                  <div
                    key={report.cedula}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm border-l-4 border-l-amber-500"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Nombre</p>
                        <p className="text-lg font-bold text-gray-900">
                          {report.nombre_completo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Edad</p>
                        <p className="text-lg font-bold text-gray-900">
                          {report.edad_aprox || "No especificada"} años
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Ubicación</p>
                        <p className="text-sm text-gray-700">{report.ultima_ubicacion}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-semibold">Reportado</p>
                        <p className="text-sm text-gray-700">
                          {new Date(report.created_at).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-900 font-semibold mb-1">Reportante</p>
                      <p className="text-sm text-amber-800">
                        {report.reportante_nombre} - {report.reportante_telefono}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/desaparecido/${report.cedula}`)}
                      >
                        Ver Reporte
                      </Button>
                      <Button
                        onClick={async () => {
                          setLoadingChildId(report.cedula);
                          const result = await markChildReportReviewed(report.cedula);
                          if (result.success) {
                            setChildReports(
                              childReports.filter((r) => r.cedula !== report.cedula)
                            );
                          } else {
                            alert("Error: " + result.error);
                          }
                          setLoadingChildId(null);
                        }}
                        disabled={loadingChildId === report.cedula}
                        isLoading={loadingChildId === report.cedula}
                      >
                        Marcar Revisado
                      </Button>
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
