"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { X, Sliders } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  GENERO_OPTIONS,
  COLOR_PIEL_OPTIONS,
  COLOR_CABELLO_OPTIONS,
  COLOR_OJOS_OPTIONS,
} from "@/lib/constants";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktop?: boolean;
}

export function FilterPanel({ isOpen, onClose, isDesktop = false }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [genero, setGenero] = useState(searchParams.get("genero") || "");
  const [colorPiel, setColorPiel] = useState(searchParams.get("colorPiel") || "");
  const [colorCabello, setColorCabello] = useState(searchParams.get("colorCabello") || "");
  const [colorOjos, setColorOjos] = useState(searchParams.get("colorOjos") || "");
  const [usaLentes, setUsaLentes] = useState(searchParams.get("usaLentes") || "");
  const [edadMin, setEdadMin] = useState(searchParams.get("edadMin") || "");
  const [edadMax, setEdadMax] = useState(searchParams.get("edadMax") || "");
  const [estaturaMin, setEstaturaMin] = useState(searchParams.get("estaturaMin") || "");
  const [estaturaMax, setEstaturaMax] = useState(searchParams.get("estaturaMax") || "");
  const [pesoMin, setPesoMin] = useState(searchParams.get("pesoMin") || "");
  const [pesoMax, setPesoMax] = useState(searchParams.get("pesoMax") || "");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    // Agregar filtros
    if (genero) params.set("genero", genero);
    else params.delete("genero");

    if (colorPiel) params.set("colorPiel", colorPiel);
    else params.delete("colorPiel");

    if (colorCabello) params.set("colorCabello", colorCabello);
    else params.delete("colorCabello");

    if (colorOjos) params.set("colorOjos", colorOjos);
    else params.delete("colorOjos");

    if (usaLentes) params.set("usaLentes", usaLentes);
    else params.delete("usaLentes");

    if (edadMin) params.set("edadMin", edadMin);
    else params.delete("edadMin");

    if (edadMax) params.set("edadMax", edadMax);
    else params.delete("edadMax");

    if (estaturaMin) params.set("estaturaMin", estaturaMin);
    else params.delete("estaturaMin");

    if (estaturaMax) params.set("estaturaMax", estaturaMax);
    else params.delete("estaturaMax");

    if (pesoMin) params.set("pesoMin", pesoMin);
    else params.delete("pesoMin");

    if (pesoMax) params.set("pesoMax", pesoMax);
    else params.delete("pesoMax");

    router.push(`?${params.toString()}`);
  };

  const handleApplyFilters = () => {
    applyFilters();
    onClose();
  };

  const handleClearFilters = () => {
    setGenero("");
    setColorPiel("");
    setColorCabello("");
    setColorOjos("");
    setUsaLentes("");
    setEdadMin("");
    setEdadMax("");
    setEstaturaMin("");
    setEstaturaMax("");
    setPesoMin("");
    setPesoMax("");

    const params = new URLSearchParams(searchParams);
    params.delete("genero");
    params.delete("colorPiel");
    params.delete("colorCabello");
    params.delete("colorOjos");
    params.delete("usaLentes");
    params.delete("edadMin");
    params.delete("edadMax");
    params.delete("estaturaMin");
    params.delete("estaturaMax");
    params.delete("pesoMin");
    params.delete("pesoMax");

    router.push(`?${params.toString()}`);
  };

  // Auto-apply filters on desktop
  useEffect(() => {
    if (!isDesktop) return;

    const timer = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timer);
  }, [genero, colorPiel, colorCabello, colorOjos, usaLentes, edadMin, edadMax, estaturaMin, estaturaMax, pesoMin, pesoMax]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Filter panel */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-full sm:w-80 bg-white shadow-lg transform transition-transform lg:transform-none z-50 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } lg:block`}
      >
        <div className={isDesktop ? "p-0" : "p-4 sm:p-6"}>
          {!isDesktop && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className={isDesktop ? "space-y-3 px-4" : "space-y-4"}>
            {/* Género */}
            <Select
              label="Género"
              placeholder="Todos"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              options={GENERO_OPTIONS.map((g) => ({
                value: g,
                label: g.charAt(0).toUpperCase() + g.slice(1),
              }))}
            />

            {/* Colores */}
            <Select
              label="Color de Piel"
              placeholder="Todos"
              value={colorPiel}
              onChange={(e) => setColorPiel(e.target.value)}
              options={COLOR_PIEL_OPTIONS.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
              }))}
            />

            <Select
              label="Color de Cabello"
              placeholder="Todos"
              value={colorCabello}
              onChange={(e) => setColorCabello(e.target.value)}
              options={COLOR_CABELLO_OPTIONS.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
              }))}
            />

            <Select
              label="Color de Ojos"
              placeholder="Todos"
              value={colorOjos}
              onChange={(e) => setColorOjos(e.target.value)}
              options={COLOR_OJOS_OPTIONS.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
              }))}
            />

            {/* Lentes */}
            <Select
              label="¿Usa Lentes?"
              placeholder="Todos"
              value={usaLentes}
              onChange={(e) => setUsaLentes(e.target.value)}
              options={[
                { value: "true", label: "Sí" },
                { value: "false", label: "No" },
              ]}
            />

            {/* Rangos */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Edad (años)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  min="0"
                  max="120"
                  value={edadMin}
                  onChange={(e) => setEdadMin(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  min="0"
                  max="120"
                  value={edadMax}
                  onChange={(e) => setEdadMax(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Estatura (cm)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  min="30"
                  max="250"
                  value={estaturaMin}
                  onChange={(e) => setEstaturaMin(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  min="30"
                  max="250"
                  value={estaturaMax}
                  onChange={(e) => setEstaturaMax(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Peso (kg)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Mín"
                  min="1"
                  max="300"
                  value={pesoMin}
                  onChange={(e) => setPesoMin(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="number"
                  placeholder="Máx"
                  min="1"
                  max="300"
                  value={pesoMax}
                  onChange={(e) => setPesoMax(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Botones - solo en mobile */}
            {!isDesktop && (
              <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
                <Button
                  className="flex-1"
                  onClick={handleApplyFilters}
                >
                  Aplicar
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleClearFilters}
                >
                  Limpiar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
