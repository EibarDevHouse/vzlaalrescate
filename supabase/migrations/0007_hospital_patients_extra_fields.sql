-- Add optional fields to hospital_patients table
-- Doctor, sexo, and procedencia

alter table public.hospital_patients add column doctor_a_cargo text;
alter table public.hospital_patients add column sexo text check (sexo in ('masculino', 'femenino', 'otro'));
alter table public.hospital_patients add column procedencia text;
