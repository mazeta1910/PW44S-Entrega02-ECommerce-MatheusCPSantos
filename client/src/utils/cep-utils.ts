export function normalizeZipCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length !== 8) {
    return value.trim();
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatZipCodeInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidZipCode(value: string): boolean {
  return /^\d{5}-?\d{3}$/.test(value.trim());
}
