import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { AuthenticationResponse, IUserLogin } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";
import AuthService from "@/services/auth-service";
import { getPostLoginPath, getUserDisplayName } from "@/utils/auth-utils";
import { performLogout } from "@/utils/logout-utils";
import { Toast } from "primereact/toast";
import "./styles.css";

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLogin & { rememberMe: boolean }>({
    defaultValues: { email: "", password: "", rememberMe: true },
  });
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? null;
  const { login } = AuthService;
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);

  const { handleLogin, authenticated, authenticatedUser, handleLogout } =
    useAuth();

  const onSubmit = async (data: IUserLogin & { rememberMe: boolean }) => {
    setLoading(true);
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });
      if (response.status === 200) {
        const authenticationResponse = response.data as AuthenticationResponse;
        handleLogin(authenticationResponse, data.rememberMe);
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Login efetuado com sucesso.",
          life: 3000,
        });
        setTimeout(() => {
          navigate(
            redirectPath ?? getPostLoginPath(authenticationResponse.user),
            { replace: true },
          );
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao efetuar login.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao efetuar login.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Toast ref={toast} />

      <div className="login-page__shell">
        <aside className="login-page__brand" aria-hidden={false}>
          <img
            src="/Logo.png"
            alt="NEXUS Store"
            className="login-page__brand-logo"
          />
          <h2 className="login-page__brand-title">Bem-vindo de volta</h2>
          <p className="login-page__brand-text">
            Acesse sua conta para acompanhar pedidos, gerenciar endereços e
            continuar de onde parou.
          </p>
          <ul className="login-page__brand-list">
            <li>
              <span className="pi pi-shopping-bag" aria-hidden />
              Catálogo de games, consoles e acessórios
            </li>
            <li>
              <span className="pi pi-truck" aria-hidden />
              Acompanhe entregas em tempo real
            </li>
            <li>
              <span className="pi pi-shield" aria-hidden />
              Compra segura na NEXUS Store
            </li>
          </ul>
        </aside>

        <section className="login-page__panel">
          <header className="login-page__panel-header">
            <h1>Entrar na conta</h1>
            <p>Use seu e-mail e senha para acessar a loja.</p>
          </header>

          {authenticated && authenticatedUser && (
            <div className="login-page__session-notice">
              <span className="pi pi-info-circle" aria-hidden />
              <div className="login-page__session-notice-body">
                <p>
                  Sessão ativa como{" "}
                  <strong>{getUserDisplayName(authenticatedUser)}</strong>.
                </p>
                <div className="login-page__session-actions">
                  <Button
                    type="button"
                    label="Continuar"
                    icon="pi pi-arrow-right"
                    size="small"
                    onClick={() =>
                      navigate(getPostLoginPath(authenticatedUser), {
                        replace: true,
                      })
                    }
                  />
                  <Button
                    type="button"
                    label="Trocar conta"
                    icon="pi pi-sign-out"
                    size="small"
                    outlined
                    severity="secondary"
                    onClick={() => performLogout(handleLogout, navigate)}
                  />
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="login-page__form"
          >
            <div className="login-page__field">
              <label htmlFor="email">E-mail</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Informe o e-mail",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Informe um e-mail válido",
                  },
                }}
                render={({ field }) => (
                  <InputText
                    id="email"
                    {...field}
                    type="email"
                    placeholder="seu@email.com"
                    className={errors.email ? "p-invalid w-full" : "w-full"}
                  />
                )}
              />
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
              )}
            </div>

            <div className="login-page__field">
              <label htmlFor="password">Senha</label>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Informe a senha" }}
                render={({ field }) => (
                  <Password
                    id="password"
                    {...field}
                    toggleMask
                    feedback={false}
                    placeholder="Sua senha"
                    className={errors.password ? "p-invalid w-full" : "w-full"}
                    inputClassName="w-full"
                  />
                )}
              />
              {errors.password && (
                <small className="p-error">{errors.password.message}</small>
              )}
            </div>

            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <div className="login-page__remember">
                  <Checkbox
                    inputId="rememberMe"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.checked ?? false)}
                  />
                  <label htmlFor="rememberMe">Ficar sempre conectado</label>
                </div>
              )}
            />

            <Button
              type="submit"
              label="Entrar"
              icon="pi pi-sign-in"
              className="w-full login-page__submit"
              loading={loading || isSubmitting}
              disabled={loading || isSubmitting}
            />
          </form>

          <div className="login-page__footer">
            Não tem uma conta? <Link to="/register">Criar conta</Link>
          </div>
        </section>
      </div>
    </div>
  );
};
