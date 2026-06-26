"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAccessRequest(
  cedula: string,
  nombre: string,
  telefono: string,
  correo: string,
  mensaje: string
) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { error: "No autenticado", success: false };
  }

  // Check if already has 5 pending requests
  const { data: existing, count } = await supabase
    .from("access_requests")
    .select("*", { count: "exact" })
    .eq("cedula", cedula)
    .eq("estado", "pendiente");

  if (count && count >= 5) {
    return { error: "Este reporte ya tiene 5 solicitudes pendientes", success: false };
  }

  // Check if already requested (pending)
  const { data: alreadyRequested } = await supabase
    .from("access_requests")
    .select("*")
    .eq("cedula", cedula)
    .eq("solicitante_id", user.user.id)
    .eq("estado", "pendiente");

  if (alreadyRequested && alreadyRequested.length > 0) {
    return { error: "Ya has solicitado acceso a este reporte", success: false };
  }

  // Create request
  const { error } = await supabase
    .from("access_requests")
    .insert({
      cedula,
      solicitante_id: user.user.id,
      mensaje,
      estado: "pendiente",
    });

  if (error) {
    console.error("Error creating access request:", error);
    return { error: error.message, success: false };
  }

  // Get report creator's email and solicitant's info
  try {
    console.log("[Email] Fetching report data for cedula:", cedula);
    const { data: reportData } = await supabase
      .from("missing_persons")
      .select("reportado_por, nombre_completo")
      .eq("cedula", cedula)
      .single();

    console.log("[Email] Report data:", reportData);

    if (reportData?.reportado_por) {
      console.log("[Email] Fetching creator data for user:", reportData.reportado_por);
      const { data: creatorData, error: creatorError } = await supabase.auth.admin.getUserById(
        reportData.reportado_por
      );

      console.log("[Email] Creator data:", creatorData);
      console.log("[Email] Creator error:", creatorError);
      console.log("[Email] Creator email:", creatorData?.user?.email);

      if (creatorData?.user?.email) {
        const { sendEmail, accessRequestTemplate } = await import(
          "@/lib/email/sender"
        );

        console.log("[Email] Sending email to:", creatorData.user?.email);
        console.log("[Email] ZOHO_SMTP_USER:", process.env.ZOHO_SMTP_USER);
        console.log("[Email] ZOHO_SMTP_HOST:", process.env.ZOHO_SMTP_HOST);

        const emailResult = await sendEmail({
          to: creatorData.user!.email,
          subject: `Nueva solicitud de acceso - ${reportData.nombre_completo}`,
          html: accessRequestTemplate({
            solicitanteName: nombre,
            solicitantePhone: telefono,
            solicitanteEmail: correo,
            mensaje,
            reportName: reportData.nombre_completo,
            cedula,
            profileUrl: `${process.env.NEXT_PUBLIC_APP_URL}/perfil`,
          }),
        });

        console.log("[Email] Send result:", emailResult);
      } else {
        console.log("[Email] No creator email found");
      }
    } else {
      console.log("[Email] No report data found");
    }
  } catch (emailError) {
    console.error("[Email] Error sending email:", emailError);
  }

  revalidatePath(`/desaparecido/${cedula}`);
  return { success: true };
}

export async function cancelAccessRequest(cedula: string) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { error: "No autenticado", success: false };
  }

  const { error } = await supabase
    .from("access_requests")
    .delete()
    .eq("cedula", cedula)
    .eq("solicitante_id", user.user.id)
    .eq("estado", "pendiente");

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath(`/desaparecido/${cedula}`);
  return { success: true };
}
