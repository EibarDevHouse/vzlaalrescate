"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Verify user is admin
async function checkIsAdmin(userId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", userId)
    .single();

  return !!data;
}

export async function approveAccessRequest(
  cedula: string,
  solicitanteId: string
) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user || !(await checkIsAdmin(user.user.id))) {
    return { error: "No tienes permisos de admin", success: false };
  }

  const { error } = await supabase
    .from("access_requests")
    .update({ estado: "aprobada" })
    .eq("cedula", cedula)
    .eq("solicitante_id", solicitanteId);

  if (error) {
    return { error: error.message, success: false };
  }

  // Send email to requester
  try {
    const { data: solicitantData } = await supabase.auth.admin.getUserById(
      solicitanteId
    );

    const { data: reportData } = await supabase
      .from("missing_persons")
      .select("nombre_completo")
      .eq("cedula", cedula)
      .single();

    if (solicitantData?.user?.email && reportData) {
      const { sendEmail, accessApprovedTemplate } = await import(
        "@/lib/email/sender"
      );

      await sendEmail({
        to: solicitantData.user.email,
        subject: `Solicitud Aprobada - ${reportData.nombre_completo}`,
        html: accessApprovedTemplate({
          reportName: reportData.nombre_completo,
          cedula,
          reportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/desaparecido/${cedula}`,
        }),
      });
    }
  } catch (emailError) {
    console.error("Error sending approval email:", emailError);
  }

  revalidatePath("/admin");
  revalidatePath(`/desaparecido/${cedula}`);
  return { success: true };
}

export async function rejectAccessRequest(
  cedula: string,
  solicitanteId: string,
  razon?: string
) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user || !(await checkIsAdmin(user.user.id))) {
    return { error: "No tienes permisos de admin", success: false };
  }

  const { error } = await supabase
    .from("access_requests")
    .update({ estado: "rechazada" })
    .eq("cedula", cedula)
    .eq("solicitante_id", solicitanteId);

  if (error) {
    return { error: error.message, success: false };
  }

  // Send email to requester
  try {
    const { data: solicitantData } = await supabase.auth.admin.getUserById(
      solicitanteId
    );

    const { data: reportData } = await supabase
      .from("missing_persons")
      .select("nombre_completo")
      .eq("cedula", cedula)
      .single();

    if (solicitantData?.user?.email && reportData) {
      const { sendEmail, accessRejectedTemplate } = await import(
        "@/lib/email/sender"
      );

      await sendEmail({
        to: solicitantData.user.email,
        subject: `Solicitud Denegada - ${reportData.nombre_completo}`,
        html: accessRejectedTemplate({
          reportName: reportData.nombre_completo,
          cedula,
        }),
      });
    }
  } catch (emailError) {
    console.error("Error sending rejection email:", emailError);
  }

  revalidatePath("/admin");
  revalidatePath(`/desaparecido/${cedula}`);
  return { success: true };
}

export async function createAbuseReport(
  cedula: string,
  motivo: string,
  detalles?: string
) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { error: "No autenticado", success: false };
  }

  const { error } = await supabase
    .from("abuse_reports")
    .insert({
      cedula,
      denunciante_id: user.user.id,
      motivo: `${motivo}${detalles ? ` - ${detalles}` : ""}`,
      estado: "pendiente",
    });

  if (error) {
    return { error: error.message, success: false };
  }

  // TODO: Send email to admin about abuse report

  return { success: true };
}

export async function getPendingAccessRequests(cedula: string) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user || !(await checkIsAdmin(user.user.id))) {
    return { error: "No tienes permisos", success: false, data: null };
  }

  const { data, error } = await supabase
    .from("access_requests")
    .select(
      `
      id,
      cedula,
      solicitante_id,
      mensaje,
      estado,
      created_at
    `
    )
    .eq("cedula", cedula)
    .eq("estado", "pendiente")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message, success: false, data: null };
  }

  return { success: true, data };
}
