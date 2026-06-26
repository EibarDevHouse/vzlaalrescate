"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin } from "lucide-react";

/* ─── Icono SVG de Instagram ─── */
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const posts = [
  {
    id: "DaApx5TAAkN",
    url: "https://www.instagram.com/p/DaApx5TAAkN/",
    label: "Centro de Acopio",
    username: "barquisimetocentro",
  },
  {
    id: "DaA6w7UJBFL",
    url: "https://www.instagram.com/p/DaA6w7UJBFL/",
    label: "Apoyo Comunidad",
    username: "comunidadlara",
  },
  {
    id: "DaDaQcIRpDD",
    url: "https://www.instagram.com/p/DaDaQcIRpDD/",
    label: "Marcas Unidas",
    username: "aliadosbqto",
  },
];

export function CommunitySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  /* Cada vez que el script cargue o el componente monte, procesar embeds */
  useEffect(() => {
    if (scriptLoaded && typeof window !== "undefined") {
      const w = window as any;
      if (w.instgrm?.Embeds?.process) {
        w.instgrm.Embeds.process();
      }
    }
  }, [scriptLoaded]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement;
    if (!card) return;
    el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
    setActiveIndex(index);
  };

  const prev = () => scrollTo(Math.max(0, activeIndex - 1));
  const next = () => scrollTo(Math.min(posts.length - 1, activeIndex + 1));

  return (
    <>
      {/* Script oficial de Instagram (carga una vez, async) */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />

      <section className="py-20 sm:py-24 bg-[#F9F7F5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── Cabecera ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
                <p className="text-[13px] font-bold text-[#C53030] uppercase tracking-widest">
                  Barquisimeto se une
                </p>
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-black text-gray-900 leading-tight">
                Unidos somos más fuertes
              </h2>
              <p className="text-gray-500 text-[15px] mt-2 max-w-lg leading-relaxed">
                Marcas, empresas y personas de Barquisimeto activas en esta
                iniciativa solidaria.
              </p>
            </div>

            {/* Flechas — solo desktop */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={prev}
                disabled={activeIndex === 0}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Post anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                disabled={activeIndex === posts.length - 1}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Post siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Slider ── */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-[88vw] sm:w-[380px] lg:w-[400px]"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">


                  {/* Instagram embed */}
                  <div
                    className="instagram-embed-wrapper"
                    style={{ minHeight: 400 }}
                  >
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={post.url}
                      data-instgrm-version="14"
                      style={{
                        background: "#FFF",
                        border: "none",
                        borderRadius: 0,
                        boxShadow: "none",
                        margin: 0,
                        maxWidth: "100%",
                        minWidth: 0,
                        padding: 0,
                        width: "100%",
                      }}
                    >
                      {/* Placeholder mientras carga */}
                      <div className="flex items-center justify-center h-[380px] bg-gray-50">
                        <div className="text-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E1306C] to-[#FD1D1D] flex items-center justify-center mx-auto mb-3">
                            <InstagramIcon className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-[13px] text-gray-400 font-medium">Cargando publicación...</p>
                          <Link
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-bold text-[#C53030] hover:underline"
                          >
                            Ver en Instagram <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </blockquote>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <Link
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 text-[13px] font-bold text-[#E1306C] hover:text-[#C1185A] transition-colors"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      Ver publicación completa en Instagram
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? "w-6 h-2 bg-[#C53030]"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir a publicación ${i + 1}`}
              />
            ))}
          </div>

          {/* CTA inferior */}
          <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-5">
            <p className="text-gray-500 text-[14px] text-center md:text-left">
              <span className="font-semibold text-gray-800">
                ¿Tu marca o negocio apoya esta causa?
              </span>{" "}
              Contáctanos, te unimos y tendrás toda la información de la base de datos.
            </p>
            <div className="flex flex-wrap justify-center gap-3 flex-shrink-0">
              <a
                href="https://wa.me/584221443321"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-all text-[13px] border border-emerald-100 hover:shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/ladevhouse/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-50 hover:bg-pink-100 text-[#E1306C] font-bold rounded-xl transition-all text-[13px] border border-pink-100 hover:shadow-sm"
              >
                <InstagramIcon className="w-4 h-4" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* Ocultar chrome de Instagram dentro del embed */
        .instagram-embed-wrapper .instagram-media {
          border: none !important;
          box-shadow: none !important;
          margin: 0 !important;
        }
        /* Ocultar scrollbar del slider */
        .instagram-embed-wrapper ~ div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
