import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  console.log("🔐 Auth callback:", { code: code ? "existe" : "no existe" });

  if (code) {
    const supabase = await createClient();

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ Error intercambiando código:", error.message);
      return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
    }

    console.log("✅ Sesión creada exitosamente");
    return NextResponse.redirect(new URL("/reportar", request.url));
  }

  console.warn("⚠️ Sin code en la URL");
  return NextResponse.redirect(new URL("/auth/auth-code-error", request.url));
}
