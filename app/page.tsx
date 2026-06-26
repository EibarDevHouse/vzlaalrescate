import Link from "next/link";
import { CommunitySlider } from "@/components/home/CommunitySlider";
import { Navbar } from "@/components/layout/Navbar";
import {
  Search,
  Plus,
  Phone,
  MapPin,
  Clock,
  Users,
  Shield,
  PawPrint,
  TriangleAlert,
  ArrowRight,
  FileText,
  CheckCircle,
  Megaphone,
  UserCheck,
  ChevronRight,
  Eye,
  HeartHandshake,
  HandHeart,
} from "lucide-react";

/* ─── Logo reutilizable ─── */
function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="circle-clip-footer">
        <circle cx="20" cy="20" r="20" />
      </clipPath>
      <g clipPath="url(#circle-clip-footer)">
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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">


        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section className="relative bg-white overflow-hidden">

          {/* Fondo decorativo sutil */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full opacity-60 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full opacity-40 translate-y-1/2 -translate-x-1/3" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">

            {/* ── Etiqueta de emergencia ── */}
            <div className="flex justify-center mb-7">
              <div className="inline-flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-full px-4 py-1.5">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-[13px] font-bold text-red-700 tracking-wide">
                  Emergencia activa — Venezuela 2026
                </span>
              </div>
            </div>

            {/* ── Título principal ── */}
            <h1 className="text-center text-[36px] sm:text-[54px] lg:text-[64px] font-black text-gray-900 leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto">
              Ayúdanos a{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#C53030]">reunir familias</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="6"
                  viewBox="0 0 200 6"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#C53030" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.4"/>
                </svg>
              </span>
              {" "}separadas por el terremoto
            </h1>

            {/* ── Descripción ── */}
            <p className="text-center text-gray-500 text-[17px] sm:text-[19px] leading-relaxed mb-10 max-w-2xl mx-auto">
              Plataforma gratuita donde cualquier persona puede reportar o buscar
              a un ser querido desaparecido. Sin burocracia. Disponible ahora mismo.
            </p>

            {/* ── CTAs ── */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C53030] hover:bg-[#A82828] active:bg-[#8B1E1E] text-white font-bold rounded-2xl transition-all duration-200 text-[17px] shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Reportar un desaparecido
              </Link>
              <Link
                href="/buscar"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#F0F4F9] font-bold rounded-2xl transition-all duration-200 text-[17px]"
              >
                <Search className="w-5 h-5" />
                Buscar desaparecidos
              </Link>
            </div>

            {/* ── Micro-trust ── */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-14">
              {[
                { icon: <Eye className="w-3.5 h-3.5" />, text: "Sin registro para buscar" },
                { icon: <Shield className="w-3.5 h-3.5" />, text: "Datos protegidos" },
                { icon: <CheckCircle className="w-3.5 h-3.5" />, text: "100% gratuito" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5">
                  <span className="text-emerald-500">{item.icon}</span>
                  <span className="text-[13px] font-medium text-gray-400">{item.text}</span>
                </div>
              ))}
            </div>

            {/* ── Zonas afectadas — chips horizontales ── */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center gap-2 justify-center mb-4">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                  Zonas con reportes activos
                </p>
              </div>

              {/* Scroll horizontal en mobile, wrap en desktop */}
              <div className="flex gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {[
                  { name: "La Guaira",      level: "Crítico",  dot: "bg-red-500",    badge: "bg-red-50 text-red-700 border-red-100" },
                  { name: "Caracas",         level: "Severo",   dot: "bg-orange-400", badge: "bg-orange-50 text-orange-700 border-orange-100" },
                  { name: "Puerto Cabello",  level: "Severo",   dot: "bg-orange-400", badge: "bg-orange-50 text-orange-700 border-orange-100" },
                  { name: "Tucacas",         level: "Moderado", dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-100" },
                ].map((zone) => (
                  <Link
                    key={zone.name}
                    href={`/buscar?zona=${encodeURIComponent(zone.name)}`}
                    className={`group flex-shrink-0 inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border rounded-xl hover:shadow-md transition-all duration-200 ${zone.badge} border`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${zone.dot}`} />
                    <span className="font-bold text-[14px] whitespace-nowrap">{zone.name}</span>
                    <span className="text-[11px] font-medium opacity-60 whitespace-nowrap hidden sm:inline">
                      {zone.level}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════
            CÓMO FUNCIONA

        ══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24 px-4 bg-[#F9F7F5]">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-xl mb-14">
              <p className="text-[#C53030] text-[13px] font-bold uppercase tracking-widest mb-3">
                Simple y rápido
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-black text-gray-900 leading-tight mb-4">
                ¿Cómo funciona la plataforma?
              </h2>
              <p className="text-gray-500 text-[16px] leading-relaxed">
                No importa si nunca usaste algo similar. En 3 minutos puedes tener
                un reporte publicado o encontrar a quien buscas.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  num: "01",
                  icon: <Plus className="w-6 h-6" />,
                  iconBg: "bg-red-50 text-[#C53030] ring-1 ring-red-100",
                  title: "Crea el reporte",
                  desc: "Sube una foto, agrega el nombre, descripción física, zona y un teléfono de contacto. Listo.",
                  cta: { label: "Comenzar ahora", href: "/login", style: "bg-[#C53030] text-white hover:bg-[#A82828]" },
                },
                {
                  num: "02",
                  icon: <Search className="w-6 h-6" />,
                  iconBg: "bg-blue-50 text-[#1E3A5F] ring-1 ring-blue-100",
                  title: "La búsqueda es pública",
                  desc: "Cualquier persona en Venezuela —sin registrarse— puede buscar por nombre, zona o características físicas.",
                  cta: { label: "Ir al buscador", href: "/buscar", style: "bg-[#1E3A5F] text-white hover:bg-[#16304F]" },
                },
                {
                  num: "03",
                  icon: <Phone className="w-6 h-6" />,
                  iconBg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
                  title: "Contacto directo",
                  desc: "Cada ficha muestra el número del familiar. Si reconoces a alguien, puedes comunicarte de inmediato.",
                  cta: null,
                },
              ].map((step) => (
                <div key={step.num} className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.iconBg}`}>
                      {step.icon}
                    </div>
                    <span className="text-[48px] font-black text-gray-100 leading-none select-none">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed mb-5">{step.desc}</p>
                  {step.cta && (
                    <Link
                      href={step.cta.href}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${step.cta.style}`}
                    >
                      {step.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TIPOS DE REPORTE
        ══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-[#C53030] text-[13px] font-bold uppercase tracking-widest mb-3">
                ¿Qué puedo reportar?
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-black text-gray-900 leading-tight mb-4">
                Personas, mascotas y zonas de ayuda
              </h2>
              <p className="text-gray-500 text-[16px] leading-relaxed">
                Reporta personas desaparecidas, mascotas extraviadas o zonas
                que necesitan insumos y ayuda urgente. Todo en un solo lugar.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Personas */}
              <Link href="/buscar" className="group bg-white border-2 border-gray-100 hover:border-[#C53030]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-1 bg-[#C53030]" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-red-50 ring-1 ring-red-100 rounded-2xl flex items-center justify-center text-[#C53030]">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-black text-gray-900">Personas</h3>
                      <p className="text-[12px] text-gray-400 font-medium">Adultos · Niños · Adultos mayores</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[14px] leading-relaxed mb-6">
                    Registra nombre, cédula, descripción física, fotografía y los
                    datos de quien puede recibir información. El reporte es visible
                    de forma inmediata para todo el país.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-7">
                    {["Nombre y foto", "Descripción física", "Cédula", "Última ubicación conocida"].map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] font-semibold rounded-full border border-gray-100">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-[#C53030] font-bold text-[14px] group-hover:gap-3 transition-all">
                    Reportar persona <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* Mascotas */}
              <Link href="/mascotas" className="group bg-white border-2 border-gray-100 hover:border-amber-400/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-amber-50 ring-1 ring-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                      <PawPrint className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-[20px] font-black text-gray-900">Mascotas</h3>
                      <p className="text-[12px] text-gray-400 font-medium">Perros · Gatos · Otros animales</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[14px] leading-relaxed mb-6">
                    Los animales también se extravían en las emergencias. Ayuda a
                    reunir a las mascotas con sus familias reportando su especie,
                    color, nombre y zona donde fue visto por última vez.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-7">
                    {["Especie y raza", "Color y foto", "Nombre", "Zona de extravío"].map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] font-semibold rounded-full border border-gray-100">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-[14px] group-hover:gap-3 transition-all">
                    Reportar mascota <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>

              {/* Zona necesita insumos */}
              <Link href="/zonas" className="group bg-white border-2 border-gray-100 hover:border-emerald-400/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-emerald-50 ring-1 ring-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        <line x1="12" y1="12" x2="12" y2="12.01"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[20px] font-black text-gray-900">Zona necesita ayuda</h3>
                      <p className="text-[12px] text-gray-400 font-medium">Insumos · Víveres · Medicamentos</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[14px] leading-relaxed mb-6">
                    Reporta una zona que necesita insumos urgentes. Indica qué
                    se necesita, deja el número de la persona o cuadrilla
                    responsable para coordinar la entrega directamente.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-7">
                    {["Zona o sector", "Insumos que faltan", "Responsable", "Número de contacto"].map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[11px] font-semibold rounded-full border border-gray-100">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-[14px] group-hover:gap-3 transition-all">
                    Reportar zona <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            BUSCADOR CTA — dos paneles lado a lado
        ══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24 px-4 bg-[#F9F7F5]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-5">

              {/* Panel buscar */}
              <div className="bg-[#1E3A5F] rounded-2xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-12 -mt-12" />
                <div className="relative">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-blue-200 mb-5">
                    <Search className="w-5 h-5" />
                  </div>
                  <h2 className="text-[24px] sm:text-[28px] font-black text-white leading-tight mb-3">
                    Busca sin necesidad de registrarte
                  </h2>
                  <p className="text-blue-200/80 text-[14px] leading-relaxed mb-7">
                    La base de datos es pública. Filtra por nombre, cédula,
                    descripción física o zona geográfica y verifica si hay
                    información sobre quien buscas.
                  </p>
                  <Link
                    href="/buscar"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#1E3A5F] font-bold rounded-xl hover:bg-blue-50 transition-all text-[15px]"
                  >
                    <Search className="w-4 h-4" />
                    Ir al buscador
                  </Link>
                </div>
              </div>

              {/* Panel reportar */}
              <div className="bg-[#C53030] rounded-2xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full -mr-12 -mb-12" />
                <div className="relative">
                  <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center text-white mb-5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-[24px] sm:text-[28px] font-black text-white leading-tight mb-3">
                    ¿Conoces a alguien que no aparece?
                  </h2>
                  <p className="text-red-100 text-[14px] leading-relaxed mb-7">
                    Crea un reporte con foto y datos de contacto. Se publica de
                    forma inmediata y cualquier persona en Venezuela podrá verlo.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#C53030] font-bold rounded-xl hover:bg-red-50 transition-all text-[15px]"
                  >
                    <Plus className="w-4 h-4" />
                    Crear reporte ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            EMERGENCIAS
        ══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-xl mb-12">
              <p className="text-[#C53030] text-[13px] font-bold uppercase tracking-widest mb-3">
                Líneas directas
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-black text-gray-900 leading-tight mb-4">
                Números de emergencia
              </h2>
              <p className="text-gray-500 text-[16px] leading-relaxed">
                Si estás en peligro o tienes información urgente, contacta
                directamente a las autoridades de rescate.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
              {[
                { org: "Protección Civil", number: "0800-PCIVIL1", role: "Respuesta a emergencias", icon: <TriangleAlert className="w-5 h-5" />, bg: "bg-red-50 text-[#C53030] ring-red-100" },
                { org: "Cruz Roja Venezuela", number: "0212-5782187", role: "Atención humanitaria", icon: <Shield className="w-5 h-5" />, bg: "bg-red-50 text-[#C53030] ring-red-100" },
                { org: "CICPC", number: "0800-CICPC24", role: "Investigación y búsqueda", icon: <UserCheck className="w-5 h-5" />, bg: "bg-blue-50 text-[#1E3A5F] ring-blue-100" },
                { org: "VEN 911 / Bomberos", number: "911", role: "Rescate y extracción", icon: <Megaphone className="w-5 h-5" />, bg: "bg-amber-50 text-amber-700 ring-amber-100" },
              ].map((item) => (
                <div key={item.org} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center mb-4 ${item.bg}`}>
                    {item.icon}
                  </div>
                  <p className="text-[12px] text-gray-400 font-semibold mb-1">{item.org}</p>
                  <p className="text-[20px] font-black text-gray-900 mb-1 tracking-tight">{item.number}</p>
                  <p className="text-[12px] text-gray-400">{item.role}</p>
                </div>
              ))}
            </div>

            {/* Aviso */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
              <div className="w-9 h-9 bg-amber-100 ring-1 ring-amber-200 rounded-xl flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
                <TriangleAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-amber-900 mb-1 text-[15px]">
                  Si localizas a una persona desaparecida
                </p>
                <p className="text-amber-800 text-[13px] leading-relaxed">
                  Primero contacta a las autoridades. Luego, busca su reporte en
                  esta plataforma y comunícate con el familiar usando el número
                  indicado en cada ficha.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            COMUNIDAD SLIDER
        ══════════════════════════════════════════ */}
        <CommunitySlider />

        {/* ══════════════════════════════════════════
            CONFIANZA
        ══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24 px-4 bg-[#F9F7F5] border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-xl mx-auto text-center mb-14">
              <p className="text-[#C53030] text-[13px] font-bold uppercase tracking-widest mb-3">
                Nuestro compromiso
              </p>
              <h2 className="text-[32px] sm:text-[38px] font-black text-gray-900 leading-tight">
                Una plataforma hecha con responsabilidad
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  iconStyle: "bg-blue-50 text-[#1E3A5F] ring-blue-100",
                  title: "Información con responsabilidad",
                  desc: "Solo publicamos los datos necesarios para la búsqueda. La información sensible no se comparte con terceros ni se usa con otros fines.",
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  iconStyle: "bg-emerald-50 text-emerald-700 ring-emerald-100",
                  title: "Disponible las 24 horas",
                  desc: "La plataforma opera sin interrupción para que nadie se quede sin la posibilidad de buscar o reportar, sin importar la hora.",
                },
                {
                  icon: <HeartHandshake className="w-6 h-6" />,
                  iconStyle: "bg-red-50 text-[#C53030] ring-red-100",
                  title: "Hecha por venezolanos",
                  desc: "Este es un proyecto voluntario, creado con el único propósito de ayudar a las familias afectadas. Sin fines de lucro.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
                  <div className={`w-11 h-11 rounded-xl ring-1 flex items-center justify-center mb-5 ${item.iconStyle}`}>
                    {item.icon}
                  </div>
                  <h3 className="text-[16px] font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA FINAL — blanco con borde rojo
        ══════════════════════════════════════════ */}
        <section className="py-20 sm:py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="border-2 border-[#C53030]/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden bg-gradient-to-br from-red-50/60 to-white">
              {/* Decoration */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-red-50 rounded-full -ml-20 -mt-20 opacity-60" />
              <div className="absolute bottom-0 right-0 w-56 h-56 bg-red-50 rounded-full -mr-28 -mb-28 opacity-60" />

              <div className="relative">
                <div className="flex justify-center mb-6">
                  <LogoMark size={56} />
                </div>
                <h2 className="text-[30px] sm:text-[40px] font-black text-gray-900 leading-tight mb-4">
                  Cada reporte puede reunir una familia
                </h2>
                <p className="text-gray-500 text-[16px] sm:text-[18px] mb-9 max-w-lg mx-auto leading-relaxed">
                  Si conoces a alguien que no aparece, crea un reporte en este
                  momento. Es gratuito y toma menos de 3 minutos.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#C53030] hover:bg-[#A82828] text-white font-bold rounded-2xl transition-all text-[16px] shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Reportar ahora — es gratis
                  </Link>
                  <Link
                    href="/buscar"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-bold rounded-2xl transition-all text-[16px]"
                  >
                    <Search className="w-5 h-5" />
                    Buscar desaparecidos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <LogoMark size={36} />
                <div>
                  <p className="text-[15px] font-black text-white leading-none">Vzla al Rescate</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                    Plataforma humanitaria
                  </p>
                </div>
              </div>
              <p className="text-gray-400 text-[13px] leading-relaxed mb-5">
                Plataforma voluntaria y gratuita para reportar y buscar
                personas desaparecidas tras el terremoto en Venezuela.
              </p>
              <p className="text-gray-600 text-[12px]">© 2026 · Sin fines de lucro</p>
            </div>

            {/* Plataforma */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">
                Plataforma
              </p>
              <ul className="space-y-3">
                {[
                  { label: "Buscar desaparecidos", href: "/buscar" },
                  { label: "Crear un reporte", href: "/login" },
                  { label: "Iniciar sesión", href: "/login" },
                  { label: "Mi perfil", href: "/perfil" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-400 hover:text-white text-[13px] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Zonas */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">
                Zonas activas
              </p>
              <ul className="space-y-3">
                {["La Guaira", "Caracas", "Puerto Cabello", "Tucacas"].map((zone) => (
                  <li key={zone}>
                    <Link
                      href={`/buscar?zona=${encodeURIComponent(zone)}`}
                      className="flex items-center gap-2 text-gray-400 hover:text-white text-[13px] transition-colors"
                    >
                      <MapPin className="w-3 h-3 text-[#C53030]" />
                      {zone}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergencias */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-5">
                Emergencias
              </p>
              <ul className="space-y-4">
                {[
                  { org: "Protección Civil", tel: "0800-PCIVIL1" },
                  { org: "Cruz Roja Venezuela", tel: "0212-5782187" },
                  { org: "CICPC", tel: "0800-CICPC24" },
                  { org: "VEN 911 / Bomberos", tel: "911" },
                ].map((item) => (
                  <li key={item.org}>
                    <p className="text-gray-600 text-[11px] uppercase tracking-wide font-semibold">{item.org}</p>
                    <p className="text-gray-300 text-[13px] font-bold mt-0.5">{item.tel}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <p className="text-gray-500 text-[12px] mb-2">
                Información de uso humanitario · Plataforma sin fines de lucro
              </p>
              <div className="flex flex-col items-start gap-2 mt-4">
                <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase tracking-widest font-bold leading-none">
                  Desarrollado solidariamente por
                </span>
                <img src="/v-blanco.svg" alt="LaDevHouse" className="h-4 sm:h-5 w-auto opacity-90 hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-gray-500 text-[11px] max-w-xl mt-3 leading-relaxed">
                Si representas a una organización de rescate, iniciativa solidaria o centro de acopio y necesitas acceso estructurado al listado de personas extraviadas o zonas que requieren insumos, podemos generar un reporte detallado gratuito de la base de datos para facilitar tu labor.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
