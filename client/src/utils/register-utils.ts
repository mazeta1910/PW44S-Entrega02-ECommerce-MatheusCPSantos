const PASSWORD_MIN_LENGTH = 8;

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).*$/;

const FULL_NAME_PATTERN = /^[A-Za-zÀ-ÿ]{2,}( [A-Za-zÀ-ÿ]{2,})+$/;

/** Mensagens alinhadas ao UserDTO do back-end. */
export const PASSWORD_MESSAGES = {
  required: "A senha é obrigatória.",
  minLength: "A senha deve ter no mínimo 8 caracteres.",
  pattern:
    "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.",
} as const;

export const PASSWORD_REQUIREMENTS_HINT =
  "Mínimo de 8 caracteres, com letra maiúscula, minúscula, número e caractere especial (@$!%*?&#).";

export function validatePassword(value: string | undefined): true | string {
  if (!value?.trim()) {
    return PASSWORD_MESSAGES.required;
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return PASSWORD_MESSAGES.minLength;
  }

  if (!PASSWORD_PATTERN.test(value)) {
    return PASSWORD_MESSAGES.pattern;
  }

  return true;
}

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

export function requiresParentLink(age: number): boolean {
  return age >= 12 && age < 16;
}

export function isRegisterAgeAllowed(age: number): boolean {
  return age >= 12;
}

export const registerValidation = {
  fullName: {
    required: "O nome completo é obrigatório.",
    maxLength: { value: 100, message: "Máximo de 100 caracteres." },
    pattern: {
      value: FULL_NAME_PATTERN,
      message:
        "Informe nome e sobrenome completos (mínimo 2 letras em cada parte).",
    },
  },
  password: {
    validate: validatePassword,
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
      value === true ||
      "Você deve aceitar os Termos de Uso e a Política de Privacidade.",
  },
  parentEmail: {
    required: "O e-mail do responsável é obrigatório.",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Informe um e-mail válido do responsável.",
    },
  },
};
