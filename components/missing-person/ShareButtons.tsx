"use client";

interface ShareButtonsProps {
  name: string;
  cedula: string;
}

export function ShareButtons({ name, cedula }: ShareButtonsProps) {
  const handleWhatsApp = () => {
    const url = window.location.href;
    const text = `Persona desaparecida: ${name} (Cédula: ${cedula})\n\nVer reporte: ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };


  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-300">
      <h3 className="font-bold text-gray-900 mb-3">Compartir</h3>
      <p className="text-sm text-gray-800 font-medium mb-4">
        Comparte este reporte en redes sociales para aumentar las posibilidades
        de encontrar a esta persona.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          📱 WhatsApp
        </button>
      </div>
    </div>
  );
}
