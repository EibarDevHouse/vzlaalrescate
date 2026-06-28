export interface HospitalPatient {
  id: string;
  nombre_completo: string;
  edad: number | null;
  cedula: string | null;
  hospital: string;
  estado: "hospitalizado" | "dado_de_alta" | "fallecido";
  doctor_a_cargo: string | null;
  sexo: "masculino" | "femenino" | "otro" | null;
  procedencia: string | null;
  created_at: string;
  updated_at: string;
}
