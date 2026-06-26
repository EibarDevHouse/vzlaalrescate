"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterPanel } from "@/components/missing-person/FilterPanel";
import { Sliders } from "lucide-react";
import { Select } from "@/components/ui/Select";
import {
  GENERO_OPTIONS,
  COLOR_PIEL_OPTIONS,
  COLOR_CABELLO_OPTIONS,
  COLOR_OJOS_OPTIONS,
} from "@/lib/constants";

interface SearchPageClientProps {
  isDesktop?: boolean;
}

export function SearchPageClient({ isDesktop = false }: SearchPageClientProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const [genero, setGenero] = useState(params.get("genero") || "");
  const [colorPiel, setColorPiel] = useState(params.get("colorPiel") || "");
  const [colorCabello, setColorCabello] = useState(params.get("colorCabello") || "");
  const [colorOjos, setColorOjos] = useState(params.get("colorOjos") || "");
  const [usaLentes, setUsaLentes] = useState(params.get("usaLentes") || "");
  const [edadMin, setEdadMin] = useState(params.get("edadMin") || "");
  const [edadMax, setEdadMax] = useState(params.get("edadMax") || "");
  const [estaturaMin, setEstaturaMin] = useState(params.get("estaturaMin") || "");
  const [estaturaMax, setEstaturaMax] = useState(params.get("estaturaMax") || "");
  const [pesoMin, setPesoMin] = useState(params.get("pesoMin") || "");
  const [pesoMax, setPesoMax] = useState(params.get("pesoMax") || "");

  const applyFilters = () => {
    const newParams = new URLSearchParams(params);
    if (genero) newParams.set("genero", genero);
    else newParams.delete("genero");
    if (colorPiel) newParams.set("colorPiel", colorPiel);
    else newParams.delete("colorPiel");
    if (colorCabello) newParams.set("colorCabello", colorCabello);
    else newParams.delete("colorCabello");
    if (colorOjos) newParams.set("colorOjos", colorOjos);
    else newParams.delete("colorOjos");
    if (usaLentes) newParams.set("usaLentes", usaLentes);
    else newParams.delete("usaLentes");
    if (edadMin) newParams.set("edadMin", edadMin);
    else newParams.delete("edadMin");
    if (edadMax) newParams.set("edadMax", edadMax);
    else newParams.delete("edadMax");
    if (estaturaMin) newParams.set("estaturaMin", estaturaMin);
    else newParams.delete("estaturaMin");
    if (estaturaMax) newParams.set("estaturaMax", estaturaMax);
    else newParams.delete("estaturaMax");
    if (pesoMin) newParams.set("pesoMin", pesoMin);
    else newParams.delete("pesoMin");
    if (pesoMax) newParams.set("pesoMax", pesoMax);
    else newParams.delete("pesoMax");
    router.push(`?${newParams.toString()}`);
  };

  const hasActiveFilters = [
    "genero",
    "colorPiel",
    "colorCabello",
    "colorOjos",
    "usaLentes",
    "edadMin",
    "edadMax",
    "estaturaMin",
    "estaturaMax",
    "pesoMin",
    "pesoMax",
  ].some(key => params.get(key));

  if (isDesktop) {
    return (
      <div className="space-y-2 text-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Filtros</h3>
        <Select
          label="Género"
          placeholder="Todos"
          value={genero}
          onChange={(e) => {
            setGenero(e.target.value);
            setTimeout(applyFilters, 0);
          }}
          options={GENERO_OPTIONS.map((g) => ({
            value: g,
            label: g.charAt(0).toUpperCase() + g.slice(1),
          }))}
        />
        <Select
          label="Piel"
          placeholder="Todos"
          value={colorPiel}
          onChange={(e) => {
            setColorPiel(e.target.value);
            setTimeout(applyFilters, 0);
          }}
          options={COLOR_PIEL_OPTIONS.map((c) => ({
            value: c,
            label: c.charAt(0).toUpperCase() + c.slice(1),
          }))}
        />
        <Select
          label="Cabello"
          placeholder="Todos"
          value={colorCabello}
          onChange={(e) => {
            setColorCabello(e.target.value);
            setTimeout(applyFilters, 0);
          }}
          options={COLOR_CABELLO_OPTIONS.map((c) => ({
            value: c,
            label: c.charAt(0).toUpperCase() + c.slice(1),
          }))}
        />
        <Select
          label="Ojos"
          placeholder="Todos"
          value={colorOjos}
          onChange={(e) => {
            setColorOjos(e.target.value);
            setTimeout(applyFilters, 0);
          }}
          options={COLOR_OJOS_OPTIONS.map((c) => ({
            value: c,
            label: c.charAt(0).toUpperCase() + c.slice(1),
          }))}
        />
        <Select
          label="Lentes"
          placeholder="Todos"
          value={usaLentes}
          onChange={(e) => {
            setUsaLentes(e.target.value);
            setTimeout(applyFilters, 0);
          }}
          options={[
            { value: "true", label: "Sí" },
            { value: "false", label: "No" },
          ]}
        />

        {/* Edad */}
        <div className="pt-1 border-t border-gray-200">
          <p className="font-semibold text-gray-700 mb-1">Edad</p>
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Mín"
              min="0"
              max="120"
              value={edadMin}
              onChange={(e) => {
                setEdadMin(e.target.value);
                setTimeout(applyFilters, 0);
              }}
              className="w-1/2 px-2 py-1 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <input
              type="number"
              placeholder="Máx"
              min="0"
              max="120"
              value={edadMax}
              onChange={(e) => {
                setEdadMax(e.target.value);
                setTimeout(applyFilters, 0);
              }}
              className="w-1/2 px-2 py-1 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Estatura */}
        <div className="pt-1 border-t border-gray-200">
          <p className="font-semibold text-gray-700 mb-1">Est. (cm)</p>
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Mín"
              min="30"
              max="250"
              value={estaturaMin}
              onChange={(e) => {
                setEstaturaMin(e.target.value);
                setTimeout(applyFilters, 0);
              }}
              className="w-1/2 px-2 py-1 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <input
              type="number"
              placeholder="Máx"
              min="30"
              max="250"
              value={estaturaMax}
              onChange={(e) => {
                setEstaturaMax(e.target.value);
                setTimeout(applyFilters, 0);
              }}
              className="w-1/2 px-2 py-1 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Peso */}
        <div className="pt-1 border-t border-gray-200">
          <p className="font-semibold text-gray-700 mb-1">Peso (kg)</p>
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Mín"
              min="1"
              max="300"
              value={pesoMin}
              onChange={(e) => {
                setPesoMin(e.target.value);
                setTimeout(applyFilters, 0);
              }}
              className="w-1/2 px-2 py-1 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <input
              type="number"
              placeholder="Máx"
              min="1"
              max="300"
              value={pesoMax}
              onChange={(e) => {
                setPesoMax(e.target.value);
                setTimeout(applyFilters, 0);
              }}
              className="w-1/2 px-2 py-1 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filter button for mobile */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors mb-6 ${
          hasActiveFilters
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-900 hover:bg-gray-300"
        }`}
      >
        <Sliders className="w-5 h-5" />
        Mostrar Filtros
      </button>

      {/* Filter panel drawer */}
      <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </>
  );
}
