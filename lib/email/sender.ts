import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST,
  port: parseInt(process.env.ZOHO_SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.ZOHO_SMTP_USER,
    pass: process.env.ZOHO_SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.ZOHO_SMTP_USER,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Email templates
export function accessRequestTemplate(data: {
  solicitanteName: string;
  solicitantePhone: string;
  solicitanteEmail: string;
  mensaje: string;
  reportName: string;
  cedula: string;
  profileUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-block { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0; }
          .info-block strong { color: #1f2937; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 12px 24px; margin: 0 10px; border-radius: 6px; text-decoration: none; font-weight: bold; }
          .button-approve { background: #10b981; color: white; }
          .button-reject { background: #ef4444; color: white; }
          .button:hover { opacity: 0.9; }
          .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❤️ Vzla Al Rescate</h1>
            <p>Nueva Solicitud de Acceso</p>
          </div>

          <div class="content">
            <p>Hola,</p>
            <p><strong>${data.solicitanteName}</strong> ha solicitado acceso para contribuir información al reporte de <strong>${data.reportName}</strong> (Cédula: ${data.cedula}).</p>

            <div class="info-block">
              <p><strong>📱 Teléfono:</strong> ${data.solicitantePhone}</p>
              <p><strong>📧 Correo:</strong> ${data.solicitanteEmail}</p>
            </div>

            <div class="info-block">
              <p><strong>💬 Mensaje:</strong></p>
              <p>${data.mensaje}</p>
            </div>

            <p>Desde tu perfil puedes revisar todas las solicitudes y decidir si apruebas o rechazas:</p>

            <div class="button-container">
              <a href="${data.profileUrl}" class="button button-approve">Ver en Mi Perfil</a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              Si rechazas esta solicitud, el solicitante recibirá una notificación.
            </p>
          </div>

          <div class="footer">
            <p>© 2026 Vzla Al Rescate. Conectando a familias en emergencias.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function accessApprovedTemplate(data: {
  reportName: string;
  cedula: string;
  reportUrl: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { display: inline-block; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; background: #10b981; color: white; }
          .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Solicitud Aprobada</h1>
          </div>

          <div class="content">
            <p>¡Excelente noticia!</p>
            <p>Tu solicitud de acceso al reporte de <strong>${data.reportName}</strong> (Cédula: ${data.cedula}) ha sido <strong>APROBADA</strong>.</p>
            <p>Ahora puedes editar y contribuir información a este reporte para ayudar a encontrar a esta persona.</p>

            <div class="button-container">
              <a href="${data.reportUrl}" class="button">Ver Reporte</a>
            </div>
          </div>

          <div class="footer">
            <p>© 2026 Vzla Al Rescate. Conectando a familias en emergencias.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function accessRejectedTemplate(data: {
  reportName: string;
  cedula: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Solicitud Denegada</h1>
          </div>

          <div class="content">
            <p>Tu solicitud de acceso al reporte de <strong>${data.reportName}</strong> (Cédula: ${data.cedula}) ha sido <strong>DENEGADA</strong>.</p>
            <p>Si crees que esto es un error, puedes intentar contactar directamente al creador del reporte a través de los datos que aparecen en el reporte.</p>
          </div>

          <div class="footer">
            <p>© 2026 Vzla Al Rescate. Conectando a familias en emergencias.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
