"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Mail } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/reportar";
  const supabase = createClient();

  // Countdown timer for rate limit
  useEffect(() => {
    if (retryAfter === null || retryAfter === 0) return;

    const timer = setInterval(() => {
      setRetryAfter((prev) => (prev && prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [retryAfter]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRetryAfter(null); // IMPORTANTE: Limpia el countdown antes de intentar
    setIsLoading(true);

    try {
      console.log("📧 Intentando login con:", email);
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
        },
      });

      console.log("📡 Respuesta de Supabase:", { error: signInError });

      if (signInError) {
        console.error("❌ Error de Supabase:", signInError.message);

        // Handle rate limiting with user-friendly message
        if (
          signInError.message.includes("rate limit") ||
          signInError.message.includes("too many")
        ) {
          console.warn("⏱️ Rate limit detectado - estableciendo countdown");
          setError(
            "Has intentado demasiadas veces. Espera 60 segundos antes de intentar de nuevo."
          );
          setRetryAfter(60);
          return;
        }
        setError(signInError.message);
        return;
      }

      console.log("✅ Email enviado exitosamente");
      setSuccess(true);
      setEmail("");
    } catch (err) {
      console.error("💥 Error inesperado:", err);
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Alert variant="success" title="✅ Correo enviado">
        <div className="space-y-3">
          <p className="font-semibold text-green-900">
            Se envió un enlace de confirmación a:
          </p>
          <p className="text-lg font-bold text-green-900 bg-green-100 px-3 py-2 rounded-lg break-all">
            {email}
          </p>
          <p className="text-sm text-green-800">
            Revisa tu correo (incluyendo la carpeta de spam) y haz clic en el enlace para confirmar tu acceso.
          </p>
        </div>
      </Alert>
    );
  }

  const isRateLimited = !!(retryAfter && retryAfter > 0);

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    // Reset rate limit when user changes email
    if (newEmail !== email) {
      setRetryAfter(null);
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {error && (
        <Alert variant="error">
          <div>
            <p>{error}</p>
            {isRateLimited && (
              <p className="text-sm font-medium mt-2">
                Reintentar en: <span className="font-bold">{retryAfter}s</span>
              </p>
            )}
          </div>
        </Alert>
      )}

      <Input
        type="email"
        label="Correo Electrónico"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => handleEmailChange(e.target.value)}
        disabled={isLoading || !!isRateLimited}
        required
        icon={<Mail className="w-5 h-5" />}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading || !email || !!isRateLimited}
      >
        {isRateLimited
          ? `Espera ${retryAfter}s...`
          : "Enviar Enlace de Acceso"}
      </Button>

      <p className="text-xs text-gray-700 text-center font-medium">
        Recibirás un enlace por correo para acceder sin contraseña
      </p>

      {isRateLimited && (
        <Alert variant="warning">
          <p className="text-sm">
            Por seguridad, limitamos la cantidad de intentos. Por favor espera antes
            de intentar de nuevo.
          </p>
        </Alert>
      )}
    </form>
  );
}
