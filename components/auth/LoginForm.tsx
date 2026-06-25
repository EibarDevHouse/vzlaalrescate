"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Alert variant="success" title="Correo enviado">
        <p>
          Hemos enviado un enlace de confirmación a <strong>{email}</strong>. Revisa tu
          correo (incluye spam) y haz clic en el enlace para continuar.
        </p>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        type="email"
        label="Correo Electrónico"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
        icon={<Mail className="w-5 h-5" />}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading || !email}
      >
        Enviar Enlace de Acceso
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Recibirás un enlace por correo para acceder sin contraseña
      </p>
    </form>
  );
}
