import { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import type { IUserProfile } from "@/commons/types";
import UserService from "@/services/user-service";
import {
  formatBirthDate,
  formatCpf,
  formatPhone,
  splitFullName,
} from "@/utils/user-utils";
import "./styles.css";

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="account-field">
      <span className="account-field__label">{label}</span>
      <span className="account-field__value">{value || "—"}</span>
    </div>
  );
}

export function AccountProfilePage() {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await UserService.getUserInfo();

      if (response.success && response.data) {
        setProfile(response.data as IUserProfile);
      } else {
        setProfile(null);
        setErrorMessage(response.message ?? "Não foi possível carregar seu perfil.");
      }

      setIsLoading(false);
    };

    void loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-content-center py-6">
        <ProgressSpinner aria-label="Carregando perfil" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="account-empty">
        <p>{errorMessage ?? "Perfil não encontrado."}</p>
      </div>
    );
  }

  const { firstName, lastName } = splitFullName(profile.fullName);

  return (
    <>
      <h1 className="account-section-title">cadastro</h1>

      <div className="account-profile-grid">
        <section className="account-card">
          <h2 className="account-card__title">Dados pessoais</h2>
          <div className="account-field-grid">
            <ProfileField label="nome" value={firstName} />
            <ProfileField label="sobrenome" value={lastName} />
            <ProfileField label="email" value={profile.email} />
            <ProfileField label="cpf" value={formatCpf(profile.cpf)} />
            <ProfileField
              label="data de nascimento"
              value={formatBirthDate(profile.birthDate)}
            />
            <ProfileField label="telefone" value={formatPhone(profile.phone)} />
          </div>
        </section>

        <section className="account-card">
          <h2 className="account-card__title">Preferências</h2>
          <div className="account-preference">
            <Checkbox
              inputId="newsletter-pref"
              checked={Boolean(profile.newsletterSubscription)}
              disabled
            />
            <label htmlFor="newsletter-pref">
              Desejo receber novidades, lançamentos e promoções por e-mail
            </label>
          </div>
        </section>
      </div>
    </>
  );
}
