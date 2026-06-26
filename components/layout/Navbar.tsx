"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Heart, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setIsAdmin(!!data);
    };

    checkAdmin();
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Heart className="w-6 h-6 text-red-600" />
            <span className="text-red-600">Vzla</span>
            <span className="text-gray-800">Al Rescate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/buscar"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Buscar
            </Link>
            {user ? (
              <>
                <Link
                  href="/reportar"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Reportar
                </Link>
                <Link
                  href="/perfil"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Mi Perfil
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => signOut()}
                  disabled={isLoading}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden p-2 text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 py-4 space-y-3">
            <Link
              href="/buscar"
              className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              Buscar
            </Link>
            {user ? (
              <>
                <Link
                  href="/reportar"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Reportar
                </Link>
                <Link
                  href="/perfil"
                  className="block text-gray-700 hover:text-blue-600 transition-colors py-2"
                >
                  Mi Perfil
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block text-red-600 hover:text-red-700 transition-colors py-2 font-semibold flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Panel de Admin
                  </Link>
                )}
                <button
                  className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoading}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block w-full px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-center"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
