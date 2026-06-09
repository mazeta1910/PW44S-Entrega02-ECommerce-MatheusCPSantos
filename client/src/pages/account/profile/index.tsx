import { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";
import type { IUserProfile, IUserProfileUpdate } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";
import UserService from "@/services/user-service";
import {
  getUserAvatarUrl,
  getUserInitial,
  hasCustomUserAvatar,
  removeUserAvatarUrl,
  setUserAvatarUrl,
  syncAuthenticatedUserName,
} from "@/utils/auth-utils";
import { showAppToast } from "@/utils/app-toast";
import { registerValidation, stripDigits } from "@/utils/register-utils";
import {
  formatBirthDate,
  formatCpf,
  formatPhone,
  splitFullName,
} from "@/utils/user-utils";
import "./styles.css";

interface AccountOutletContext {
  userLabel: string;
  onAvatarUpdated?: () => void;
}

interface ProfileFormValues {
  fullName: string;
  phone: string;
  newsletterSubscription: boolean;
}

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
  const { authenticatedUser, refreshAuthenticatedUser } = useAuth();
  const { onAvatarUpdated } = useOutletContext<AccountOutletContext>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(() =>
    getUserAvatarUrl(authenticatedUser),
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      newsletterSubscription: false,
    },
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const response = await UserService.getUserInfo();

    if (response.success && response.data) {
      const data = response.data as IUserProfile;
      setProfile(data);
      reset({
        fullName: data.fullName,
        phone: formatPhone(data.phone),
        newsletterSubscription: Boolean(data.newsletterSubscription),
      });
    } else {
      setProfile(null);
      setErrorMessage(response.message ?? "Não foi possível carregar seu perfil.");
    }

    setIsLoading(false);
  }, [reset]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    setAvatarUrlState(getUserAvatarUrl(authenticatedUser));
  }, [authenticatedUser]);

  const openEditDialog = () => {
    if (!profile) {
      return;
    }

    reset({
      fullName: profile.fullName,
      phone: formatPhone(profile.phone),
      newsletterSubscription: Boolean(profile.newsletterSubscription),
    });
    setEditVisible(true);
  };

  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const email = authenticatedUser?.email;

    if (!file || !email) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAppToast({
        severity: "warn",
        summary: "Arquivo inválido",
        detail: "Selecione uma imagem (JPG, PNG ou WebP).",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showAppToast({
        severity: "warn",
        summary: "Imagem grande",
        detail: "A foto deve ter no máximo 2 MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUserAvatarUrl(email, dataUrl);
      setAvatarUrlState(dataUrl);
      onAvatarUpdated?.();
      showAppToast({
        severity: "success",
        summary: "Foto atualizada",
        detail: "Sua foto de perfil foi salva neste dispositivo.",
      });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemoveAvatar = () => {
    const email = authenticatedUser?.email;
    if (!email) {
      return;
    }

    removeUserAvatarUrl(email);
    setAvatarUrlState(getUserAvatarUrl(authenticatedUser));
    onAvatarUpdated?.();
    showAppToast({
      severity: "info",
      summary: "Foto removida",
      detail: "A foto personalizada foi removida.",
    });
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);

    const payload: IUserProfileUpdate = {
      fullName: values.fullName.trim(),
      phone: stripDigits(values.phone),
      newsletterSubscription: values.newsletterSubscription,
    };

    const response = await UserService.updateProfile(payload);

    if (response.success && response.data) {
      const updated = response.data as IUserProfile;
      setProfile(updated);
      syncAuthenticatedUserName(updated.fullName);
      refreshAuthenticatedUser();
      setEditVisible(false);
      showAppToast({
        severity: "success",
        summary: "Perfil atualizado",
        detail: "Seus dados foram salvos com sucesso.",
      });
    } else {
      showAppToast({
        severity: "error",
        summary: "Erro ao salvar",
        detail: response.message ?? "Não foi possível atualizar seus dados.",
      });
    }

    setIsSaving(false);
  };

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
      <h2 className="account-section-title">Meus dados</h2>

      <div className="account-profile-grid">
        <section className="account-card">
          <div className="account-card__header">
            <h3 className="account-card__title">Dados pessoais</h3>
            <Button
              type="button"
              label="Editar"
              icon="pi pi-pencil"
              size="small"
              outlined
              onClick={openEditDialog}
            />
          </div>

          <div className="account-profile-avatar-row">
            {avatarUrl ? (
              <Avatar
                image={avatarUrl}
                shape="circle"
                size="large"
                className="account-profile-avatar"
              />
            ) : (
              <Avatar
                label={getUserInitial(authenticatedUser)}
                shape="circle"
                size="large"
                className="account-profile-avatar bg-primary"
              />
            )}
            <div className="account-profile-avatar-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="account-profile-avatar-input"
                onChange={handleAvatarSelect}
              />
              <Button
                type="button"
                label="Alterar foto"
                icon="pi pi-camera"
                size="small"
                text
                onClick={() => fileInputRef.current?.click()}
              />
              {hasCustomUserAvatar(authenticatedUser?.email) && (
                <Button
                  type="button"
                  label="Remover foto"
                  icon="pi pi-times"
                  size="small"
                  text
                  severity="secondary"
                  onClick={handleRemoveAvatar}
                />
              )}
            </div>
          </div>

          <div className="account-field-grid">
            <ProfileField label="Nome" value={firstName} />
            <ProfileField label="Sobrenome" value={lastName} />
            <ProfileField label="E-mail" value={profile.email} />
            <ProfileField label="CPF" value={formatCpf(profile.cpf)} />
            <ProfileField
              label="Data de nascimento"
              value={formatBirthDate(profile.birthDate)}
            />
            <ProfileField label="Telefone" value={formatPhone(profile.phone)} />
          </div>
        </section>

        <section className="account-card">
          <h3 className="account-card__title">Preferências</h3>
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

      <Dialog
        header="Editar dados pessoais"
        visible={editVisible}
        onHide={() => !isSaving && setEditVisible(false)}
        className="account-profile-dialog"
        style={{ width: "min(520px, 94vw)" }}
        modal
        draggable={false}
      >
        <form className="account-profile-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="account-profile-form__field">
            <label htmlFor="edit-fullName">Nome completo</label>
            <Controller
              name="fullName"
              control={control}
              rules={registerValidation.fullName}
              render={({ field }) => (
                <InputText
                  id="edit-fullName"
                  {...field}
                  className={classNames("w-full", {
                    "p-invalid": errors.fullName,
                  })}
                />
              )}
            />
            {errors.fullName && (
              <small className="p-error">{errors.fullName.message}</small>
            )}
          </div>

          <div className="account-profile-form__field">
            <label htmlFor="edit-phone">Telefone</label>
            <Controller
              name="phone"
              control={control}
              rules={registerValidation.phone}
              render={({ field }) => (
                <InputMask
                  id="edit-phone"
                  {...field}
                  mask="(99) 99999-9999"
                  className={classNames("w-full", {
                    "p-invalid": errors.phone,
                  })}
                />
              )}
            />
            {errors.phone && (
              <small className="p-error">{errors.phone.message}</small>
            )}
          </div>

          <Controller
            name="newsletterSubscription"
            control={control}
            render={({ field }) => (
              <div className="account-preference">
                <Checkbox
                  inputId="edit-newsletter"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.checked ?? false)}
                />
                <label htmlFor="edit-newsletter">
                  Receber novidades e promoções por e-mail
                </label>
              </div>
            )}
          />

          <p className="account-profile-form__hint">
            E-mail, CPF e data de nascimento não podem ser alterados por aqui.
          </p>

          <div className="account-profile-form__actions">
            <Button
              type="button"
              label="Cancelar"
              severity="secondary"
              text
              disabled={isSaving}
              onClick={() => setEditVisible(false)}
            />
            <Button
              type="submit"
              label="Salvar alterações"
              icon="pi pi-check"
              loading={isSaving}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
}
