export function normalizeCedula(raw: string): string {
  const cleaned = raw.trim().toUpperCase().replace(/[\s.]/g, "");

  const match = cleaned.match(/^([VE])-?(\d{7,8})$/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }

  // If only digits, assume V (nacionalidad) by default
  const onlyDigits = cleaned.match(/^(\d{7,8})$/);
  if (onlyDigits) {
    return `V-${onlyDigits[1]}`;
  }

  return cleaned; // Leave as-is if invalid; Zod will reject it
}

export function isValidCedulaFormat(cedula: string): boolean {
  return /^[VE]-\d{7,8}$/.test(cedula);
}

export function generateSyntheticCedula(): string {
  const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
  return `SC-${digits}`;
}
