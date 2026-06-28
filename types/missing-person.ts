export interface MissingPerson {
  cedula: string;
  nombre_completo: string;
  descripcion_fisica: string;
  ultima_ubicacion: string;
  foto_url: string;
  reportante_nombre: string;
  reportante_telefono: string;
  reportante_relacion: string;
  reportado_por: string;
  estado: "desaparecido" | "encontrado_vivo" | "encontrado_fallecido";
  edad_aprox: number | null;
  genero: string | null;
  color_piel: string | null;
  color_cabello: string | null;
  color_ojos: string | null;
  usa_lentes: boolean | null;
  estatura_cm: number | null;
  peso_kg: number | null;
  created_at: string;
  updated_at: string;
  tiene_cedula?: boolean;
  requiere_revision?: boolean;
}

export interface FaceMatchResult {
  cedula: string;
  similarity: number;
  missingPerson: MissingPerson;
}

export interface SearchFilters {
  genero?: string;
  colorPiel?: string;
  colorCabello?: string;
  colorOjos?: string;
  usaLentes?: boolean;
  edadMin?: number;
  edadMax?: number;
  estaturaMin?: number;
  estaturaMax?: number;
  pesoMin?: number;
  pesoMax?: number;
}
