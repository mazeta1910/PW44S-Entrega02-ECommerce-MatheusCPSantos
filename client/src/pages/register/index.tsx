import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { useMemo, useRef, useState } from "react";
import type { IApiError, IRegisterFormValues, IResponse, IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";
import {
  calculateAge,
  formatDateToIso,
  isRegisterAgeAllowed,
  registerValidation,
  requiresParentLink,
  stripDigits,
} from "@/utils/register-utils";
import { PRIME_LOCALE_PT } from "@/constants/prime-locale-pt";
import "./styles.css";

const defaultValues: IRegisterFormValues = {
  fullName: "",
  password: "",
  confirmPassword: "",
  birthDate: null,
  email: "",
  cpf: "",
  phone: "",
  newsletterSubscription: false,
  parentEmail: "",
  termsAccepted: false,
};

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterFormValues>({ defaultValues, mode: "onBlur" });

  const { signup } = AuthService;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const birthDate = watch("birthDate");
  const password = watch("password");

  const age = useMemo(
    () => (birthDate ? calculateAge(birthDate) : null),
    [birthDate],
  );

  const showParentField = age != null && requiresParentLink(age);
  const maxBirthDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }, []);

  const isParentAccountMissingMessage = (message: string) =>
    message.toLowerCase().includes("não encontramos uma conta")
    || message.toLowerCase().includes("precisa se cadastrar na loja");

  const showRegistrationErrors = (response: IResponse) => {
    const apiError = response.data as IApiError | undefined;
    const validationErrors = apiError?.validationErrors ?? {};
    const parentEmailError = validationErrors.parentEmail;

    if (parentEmailError) {
      setError("parentEmail", { type: "server", message: parentEmailError });
      toast.current?.show({
        severity: isParentAccountMissingMessage(parentEmailError) ? "warn" : "error",
        summary: isParentAccountMissingMessage(parentEmailError)
          ? "Responsável sem conta"
          : "E-mail do responsável",
        detail: parentEmailError,
        life: 9000,
      });
      return;
    }

    const fieldKeys = Object.keys(validationErrors) as (keyof IRegisterFormValues)[];
    if (fieldKeys.length > 0) {
      fieldKeys.forEach((field) => {
        const detail = validationErrors[field];
        if (field in defaultValues) {
          setError(field, { type: "server", message: detail });
        }
        toast.current?.show({
          severity: "error",
          summary: "Validação",
          detail,
          life: 6000,
        });
      });
      return;
    }

    toast.current?.show({
      severity: "error",
      summary: "Erro",
      detail:
        apiError?.message
        ?? response.message
        ?? "Falha ao cadastrar usuário.",
      life: 5000,
    });
  };

  const onSubmit = async (data: IRegisterFormValues) => {
    if (!data.birthDate) {
      return;
    }

    const userAge = calculateAge(data.birthDate);

    if (!isRegisterAgeAllowed(userAge)) {
      toast.current?.show({
        severity: "warn",
        summary: "Idade mínima",
        detail: "É necessário ter pelo menos 12 anos para se cadastrar.",
        life: 5000,
      });
      return;
    }

    if (requiresParentLink(userAge) && !data.parentEmail.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Responsável obrigatório",
        detail:
          "Menores de 16 anos precisam informar o e-mail da conta do responsável.",
        life: 5000,
      });
      return;
    }

    const payload: IUserRegister = {
      fullName: data.fullName.trim(),
      password: data.password,
      confirmPassword: data.confirmPassword,
      birthDate: formatDateToIso(data.birthDate),
      email: data.email.trim(),
      cpf: stripDigits(data.cpf),
      phone: stripDigits(data.phone),
      newsletterSubscription: data.newsletterSubscription,
      termsAccepted: data.termsAccepted,
      ...(data.parentEmail.trim()
        ? { parentEmail: data.parentEmail.trim() }
        : {}),
    };

    setLoading(true);
    try {
      const response = await signup(payload);
      if (response.success && (response.status === 201 || response.status === 200)) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Usuário cadastrado com sucesso.",
          life: 3000,
        });
        setTimeout(() => navigate("/login"), 1000);
        return;
      }

      showRegistrationErrors(response);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao cadastrar usuário.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Toast ref={toast} />
      <Card title="Criar conta" className="register-page__card">
        <p className="register-page__intro">
          Preencha os dados abaixo para criar sua conta na NEXUS Store.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <section className="register-form__section">
            <h2 className="register-form__section-title">Dados pessoais</h2>
            <div className="register-form__grid">
              <div className="register-form__field register-form__field--full">
                <label htmlFor="fullName">Nome completo</label>
                <Controller
                  name="fullName"
                  control={control}
                  rules={registerValidation.fullName}
                  render={({ field }) => (
                    <InputText
                      id="fullName"
                      {...field}
                      className={classNames("w-full", {
                        "p-invalid": errors.fullName,
                      })}
                      placeholder="Nome e sobrenome"
                    />
                  )}
                />
                {errors.fullName && (
                  <small className="p-error">{errors.fullName.message}</small>
                )}
              </div>

              <div className="register-form__field">
                <label htmlFor="birthDate">Data de nascimento</label>
                <Controller
                  name="birthDate"
                  control={control}
                  rules={registerValidation.birthDate}
                  render={({ field }) => (
                    <Calendar
                      id="birthDate"
                      value={field.value}
                      onChange={(event) => field.onChange(event.value ?? null)}
                      locale={PRIME_LOCALE_PT}
                      dateFormat="dd/mm/yy"
                      showIcon
                      maxDate={maxBirthDate}
                      placeholder="dd/mm/aaaa"
                      className={classNames("w-full", {
                        "p-invalid": errors.birthDate,
                      })}
                      inputClassName="w-full"
                    />
                  )}
                />
                {errors.birthDate && (
                  <small className="p-error">{errors.birthDate.message}</small>
                )}
                {age != null && (
                  <small
                    className={classNames("register-form__hint", {
                      "register-form__hint--error": !isRegisterAgeAllowed(age),
                    })}
                  >
                    Idade informada: {age} anos
                    {!isRegisterAgeAllowed(age) && " (idade mínima: 12 anos)"}
                  </small>
                )}
              </div>

              <div className="register-form__field">
                <label htmlFor="email">E-mail</label>
                <Controller
                  name="email"
                  control={control}
                  rules={registerValidation.email}
                  render={({ field }) => (
                    <InputText
                      id="email"
                      {...field}
                      type="email"
                      className={classNames("w-full", {
                        "p-invalid": errors.email,
                      })}
                      placeholder="seu@email.com"
                    />
                  )}
                />
                {errors.email && (
                  <small className="p-error">{errors.email.message}</small>
                )}
              </div>

              <div className="register-form__field">
                <label htmlFor="cpf">CPF</label>
                <Controller
                  name="cpf"
                  control={control}
                  rules={registerValidation.cpf}
                  render={({ field }) => (
                    <InputMask
                      id="cpf"
                      {...field}
                      mask="999.999.999-99"
                      className={classNames("w-full", {
                        "p-invalid": errors.cpf,
                      })}
                      placeholder="000.000.000-00"
                    />
                  )}
                />
                {errors.cpf && (
                  <small className="p-error">{errors.cpf.message}</small>
                )}
              </div>

              <div className="register-form__field">
                <label htmlFor="phone">Telefone</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={registerValidation.phone}
                  render={({ field }) => (
                    <InputMask
                      id="phone"
                      {...field}
                      mask="(99) 99999-9999"
                      className={classNames("w-full", {
                        "p-invalid": errors.phone,
                      })}
                      placeholder="(00) 00000-0000"
                    />
                  )}
                />
                {errors.phone && (
                  <small className="p-error">{errors.phone.message}</small>
                )}
              </div>
            </div>
          </section>

          {showParentField && (
            <>
              <Divider />
              <section className="register-form__section">
                <h2 className="register-form__section-title">Responsável</h2>
                <div className="register-form__field register-form__field--full">
                  <label htmlFor="parentEmail">E-mail do responsável</label>
                  <Controller
                    name="parentEmail"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (!showParentField) return true;
                        const trimmed = value.trim();
                        if (!trimmed) {
                          return "Informe o e-mail da conta do responsável (maior de 18 anos).";
                        }
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                          return "Informe um e-mail válido do responsável.";
                        }
                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <InputText
                        id="parentEmail"
                        {...field}
                        type="email"
                        placeholder="responsavel@email.com"
                        className={classNames("w-full", {
                          "p-invalid": errors.parentEmail,
                        })}
                      />
                    )}
                  />
                  {errors.parentEmail && (
                    <small className="p-error">{errors.parentEmail.message}</small>
                  )}
                  {errors.parentEmail?.message
                    && isParentAccountMissingMessage(errors.parentEmail.message) && (
                    <div className="register-form__parent-alert" role="alert">
                      <i className="pi pi-info-circle register-form__parent-alert-icon" />
                      <div>
                        <strong>O responsável ainda não tem conta na loja</strong>
                        <p>
                          Peça para ele criar o cadastro primeiro em{" "}
                          <Link to="/register" className="register-form__terms-link">
                            Criar conta
                          </Link>
                          . Depois, volte aqui e informe o mesmo e-mail usado
                          no cadastro dele.
                        </p>
                      </div>
                    </div>
                  )}
                  <small className="register-form__hint">
                    Obrigatório para menores de 16 anos. Informe o e-mail da
                    conta do pai, mãe ou responsável legal — ele precisa já
                    estar cadastrado na loja e ser maior de 18 anos.
                  </small>
                </div>
              </section>
            </>
          )}

          <Divider />

          <section className="register-form__section">
            <h2 className="register-form__section-title">Segurança</h2>
            <div className="register-form__grid">
              <div className="register-form__field">
                <label htmlFor="password">Senha</label>
                <Controller
                  name="password"
                  control={control}
                  rules={registerValidation.password}
                  render={({ field }) => (
                    <Password
                      id="password"
                      {...field}
                      toggleMask
                      feedback
                      promptLabel="Escolha uma senha"
                      weakLabel="Fraca"
                      mediumLabel="Média"
                      strongLabel="Forte"
                      className={classNames("w-full", {
                        "p-invalid": errors.password,
                      })}
                      inputClassName="w-full"
                    />
                  )}
                />
                {errors.password && (
                  <small className="p-error">{errors.password.message}</small>
                )}
              </div>

              <div className="register-form__field">
                <label htmlFor="confirmPassword">Confirmar senha</label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    ...registerValidation.confirmPassword,
                    validate: (value) =>
                      value === password || "As senhas informadas não coincidem.",
                  }}
                  render={({ field }) => (
                    <Password
                      id="confirmPassword"
                      {...field}
                      toggleMask
                      feedback={false}
                      className={classNames("w-full", {
                        "p-invalid": errors.confirmPassword,
                      })}
                      inputClassName="w-full"
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <small className="p-error">
                    {errors.confirmPassword.message}
                  </small>
                )}
              </div>
            </div>
          </section>

          <Divider />

          <section className="register-form__section register-form__preferences">
            <Controller
              name="newsletterSubscription"
              control={control}
              render={({ field }) => (
                <div className="register-form__checkbox-row">
                  <Checkbox
                    inputId="newsletterSubscription"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.checked ?? false)}
                  />
                  <label htmlFor="newsletterSubscription">
                    Quero receber novidades e promoções por e-mail
                  </label>
                </div>
              )}
            />

            <Controller
              name="termsAccepted"
              control={control}
              rules={registerValidation.termsAccepted}
              render={({ field }) => (
                <div className="register-form__checkbox-row">
                  <Checkbox
                    inputId="termsAccepted"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.checked ?? false)}
                    className={classNames({ "p-invalid": errors.termsAccepted })}
                  />
                  <label htmlFor="termsAccepted">
                    Li e aceito os{" "}
                    <Link
                      to="/termos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="register-form__terms-link"
                    >
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link
                      to="/privacidade"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="register-form__terms-link"
                    >
                      Política de Privacidade
                    </Link>{" "}
                    da NEXUS Store *
                  </label>
                </div>
              )}
            />
            {errors.termsAccepted && (
              <small className="p-error">{errors.termsAccepted.message}</small>
            )}
          </section>

          <Button
            type="submit"
            label="Criar conta"
            icon="pi pi-user-plus"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
            className="w-full register-form__submit"
          />

          <div className="register-form__footer">
            <small>
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary">
                Fazer login
              </Link>
            </small>
          </div>
        </form>
      </Card>
    </div>
  );
};
