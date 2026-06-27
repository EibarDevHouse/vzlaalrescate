"use client";

import { useState, useEffect } from "react";

interface ShareButtonsProps {
  name: string;
  cedula: string;
}

export function ShareButtons({ name, cedula }: ShareButtonsProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  // Generate share URLs
  const whatsappUrl = `https://wa.me/?text=Persona%20desaparecida:%20${encodeURIComponent(
    name
  )}%20(C%C3%A9dula:%20${encodeURIComponent(cedula)})%0A%0AVer%20reporte:%20${encodeURIComponent(url)}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=Persona%20desaparecida:%20${encodeURIComponent(
    name
  )}%0A${encodeURIComponent(url)}&hashtags=VzlaAlRescate,Desaparecido`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(
    `Persona desaparecida: ${name}`
  )}`;

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-300">
      <h3 className="font-bold text-gray-900 mb-3">Compartir</h3>
      <p className="text-sm text-gray-800 font-medium mb-4">
        Comparte este reporte en redes sociales para aumentar las posibilidades
        de encontrar a esta persona.
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={whatsappUrl}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          📱 WhatsApp
        </a>
        <a
          href={twitterUrl}
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          𝕏 Twitter
        </a>
        <a
          href={facebookUrl}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          f Facebook
        </a>
      </div>
    </div>
  );
}
