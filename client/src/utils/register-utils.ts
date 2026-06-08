const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).*$/;

const FULL_NAME_PATTERN = /^[A-Za-zÀ-ÿ]+( [A-Za-zÀ-ÿ]+)+$/;

export function stripDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return age;
}

export function requiresParentId(age: number): boolean {
  return age >= 12 && age < 16;
}

export function isRegisterAgeAllowed(age: number): boolean {
  return age >= 12;
}

export const registerValidation = {
  fullName: {
    required: "O nome completo é obrigatório.",
    minLength: { value: 4, message: "Mínimo de 4 caracteres." },
    maxLength: { value: 100, message: "Máximo de 100 caracteres." },
    pattern: {
      value: FULL_NAME_PATTERN,
      message: "Informe nome e sobrenome (apenas letras).",
    },
  },
  password: {
    required: "A senha é obrigatória.",
    minLength: { value: 8, message: "A senha deve ter no mínimo 8 caracteres." },
    pattern: {
      value: PASSWORD_PATTERN,
      message:
        "Use maiúscula, minúscula, número e caractere especial (@$!%*?&#).",
    },
  },
  confirmPassword: {
    required: "A confirmação de senha é obrigatória.",
  },
  email: {
    required: "O e-mail é obrigatório.",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Informe um e-mail válido.",
    },
  },
  cpf: {
    required: "O CPF é obrigatório.",
    validate: (value: string) => {
      const digits = stripDigits(value);
      if (digits.length < 11 || digits.length > 14) {
        return "O CPF deve conter entre 11 e 14 dígitos.";
      }
      return true;
    },
  },
  phone: {
    required: "O telefone é obrigatório.",
    validate: (value: string) => {
      const digits = stripDigits(value);
      if (!/^[0-9]{10,11}$/.test(digits)) {
        return "Informe DDD + número (10 ou 11 dígitos).";
      }
      return true;
    },
  },
  birthDate: {
    required: "A data de nascimento é obrigatória.",
  },
  termsAccepted: {
    validate: (value: boolean) =>
      value === true || "Você deve aceitar os termos de uso.",
  },
};
