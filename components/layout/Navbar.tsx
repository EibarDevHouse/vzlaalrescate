"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Settings, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

/* ─── Logo SVG: bandera de Venezuela ─── */
function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <clipPath id="circle-clip">
        <circle cx="20" cy="20" r="20" />
      </clipPath>
      
      <g clipPath="url(#circle-clip)">
        <rect x="0" y="0" width="40" height="13.33" fill="#FCE300" />
        <rect x="0" y="13.33" width="40" height="13.33" fill="#0038A8" />
        <rect x="0" y="26.66" width="40" height="13.33" fill="#CE1126" />
        <g fill="#FFFFFF">
          <circle cx="10" cy="22" r="1" />
          <circle cx="12.5" cy="19.5" r="1" />
          <circle cx="15.5" cy="18" r="1" />
          <circle cx="18.5" cy="17.2" r="1" />
          <circle cx="21.5" cy="17.2" r="1" />
          <circle cx="24.5" cy="18" r="1" />
          <circle cx="27.5" cy="19.5" r="1" />
          <circle cx="30" cy="22" r="1" />
        </g>
      </g>
    </svg>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) { setIsAdmin(false); return; }
      const { data } = await supabase
        .from("admin_users").select("*").eq("user_id", user.id).single();
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Barra de alerta — sutil, oscura, no agresiva ── */}
      <div className="bg-[#1E3A5F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center justify-center gap-2.5 flex-wrap text-center">
            <span className="flex items-center gap-1.5 flex-shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[12px] font-bold text-red-300 uppercase tracking-wider">
                Emergencia activa
              </span>
            </span>
            <span className="text-blue-300/60 text-[12px] hidden sm:inline">·</span>
            <span className="text-[12px] text-blue-100 font-medium">
              Terremoto en Venezuela — La Guaira, Caracas, Puerto Cabello y Tucacas
            </span>
            <span className="text-blue-300/60 text-[12px] hidden sm:inline">·</span>
            <Link
              href="/buscar"
              className="text-[12px] font-bold text-white underline underline-offset-2 hover:text-blue-200 transition-colors flex-shrink-0"
            >
              Ver reportes →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Navbar principal ── */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled
            ? "shadow-[0_1px_12px_rgba(0,0,0,0.06)] border-b border-gray-100"
            : "border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-[64px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="group-hover:scale-105 transition-transform duration-200">
                <LogoMark size={38} />
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-black text-gray-900 leading-none tracking-tight">
                  Vzla al Rescate
                </span>
                <span className="text-[10px] font-bold text-[#C53030] uppercase tracking-[0.12em] leading-none mt-[3px]">
                  Buscamos a los tuyos
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-0.5">
              <Link
                href="/buscar"
                className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:text-[#1E3A5F] hover:bg-slate-50 rounded-lg transition-all"
              >
                Personas
              </Link>
              <Link
                href="/mascotas"
                className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:text-[#1E3A5F] hover:bg-slate-50 rounded-lg transition-all"
              >
                Mascotas
              </Link>
              <Link
                href="/zonas"
                className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:text-[#1E3A5F] hover:bg-slate-50 rounded-lg transition-all"
              >
                Zonas
              </Link>
              <Link
                href="/pacientes"
                className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:text-[#1E3A5F] hover:bg-slate-50 rounded-lg transition-all"
              >
                Pacientes
              </Link>
              {user ? (
                <>
                  <Link href="/perfil" className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:text-[#1E3A5F] hover:bg-slate-50 rounded-lg transition-all">
                    Mi perfil
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:text-[#1E3A5F] hover:bg-slate-50 rounded-lg transition-all flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5" /> Admin
                    </Link>
                  )}
                  <div className="w-px h-5 bg-gray-200 mx-2" />
                  <button
                    onClick={() => signOut()}
                    disabled={isLoading}
                    className="px-4 py-2 text-[14px] font-semibold text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-40"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-[14px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/login"
                    className="ml-2 px-5 py-2.5 text-[14px] font-bold bg-[#C53030] hover:bg-[#A82828] text-white rounded-xl transition-all duration-200 shadow-sm"
                  >
                    Reportar desaparecido
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* ── Mobile drawer ── */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-gray-100 pt-2 pb-6">
              {/* Search links */}
              <Link
                href="/buscar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-gray-800 hover:bg-slate-50 rounded-xl transition-all group"
              >
                <span>Buscar personas</span>
                <span className="text-xs px-2 py-0.5 bg-[#1E3A5F] text-white rounded-full font-bold">
                  Sin registro
                </span>
              </Link>
              <Link
                href="/mascotas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-gray-800 hover:bg-slate-50 rounded-xl transition-all group"
              >
                <span>Buscar mascotas</span>
                <span className="text-xs px-2 py-0.5 bg-amber-600 text-white rounded-full font-bold">
                  Sin registro
                </span>
              </Link>
              <Link
                href="/zonas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-gray-800 hover:bg-slate-50 rounded-xl transition-all group"
              >
                <span>Zonas con ayuda</span>
                <span className="text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full font-bold">
                  Sin registro
                </span>
              </Link>
              <Link
                href="/pacientes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-gray-800 hover:bg-slate-50 rounded-xl transition-all group"
              >
                <span>Pacientes en hospitales</span>
                <span className="text-xs px-2 py-0.5 bg-cyan-600 text-white rounded-full font-bold">
                  Sin registro
                </span>
              </Link>

              {user ? (
                <>
                  <Link href="/perfil" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-4 py-3.5 text-[15px] font-semibold text-gray-700 hover:bg-slate-50 rounded-xl transition-all">
                    Mi perfil
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-4 py-3.5 text-[15px] font-semibold text-red-700 hover:bg-red-50 rounded-xl transition-all">
                      <Settings className="w-4 h-4" /> Panel administrativo
                    </Link>
                  )}
                  <div className="my-3 mx-4 h-px bg-gray-100" />
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 text-[15px] text-gray-400 hover:bg-gray-50 rounded-xl font-medium transition-all disabled:opacity-40"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="px-1 pt-2 space-y-2">
                  {/* Main CTA — reportar */}
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-[#C53030] hover:bg-[#A82828] text-white font-bold rounded-2xl transition-all text-[16px] shadow-md"
                  >
                    Reportar un desaparecido
                  </Link>
                  {/* Secondary */}
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3.5 text-[15px] font-semibold text-gray-600 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
