export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function formatCpf(cpf?: string | null): string {
  if (!cpf) {
    return "—";
  }

  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) {
    return cpf;
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatPhone(phone?: string | null): string {
  if (!phone) {
    return "—";
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

export function formatBirthDate(value?: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

export function formatOrderDate(value?: string | null): string {
  return formatBirthDate(value);
}

export function formatEstimatedDeliveryDate(
  orderDate?: string | null,
  estimatedDays?: number | null,
): string | null {
  if (!orderDate || estimatedDays == null || estimatedDays <= 0) {
    return null;
  }

  const base = new Date(`${orderDate}T12:00:00`);
  if (Number.isNaN(base.getTime())) {
    return null;
  }

  base.setDate(base.getDate() + estimatedDays);

  return base.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatAddressLine(address: {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}): string {
  const complement = address.complement ? `, ${address.complement}` : "";

  return `${address.street}, ${address.number}${complement} — ${address.neighborhood}, ${address.city}/${address.state} — CEP ${address.zipCode}`;
}
