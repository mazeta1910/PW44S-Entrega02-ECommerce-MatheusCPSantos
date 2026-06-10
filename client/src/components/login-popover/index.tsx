import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import type { AuthenticationResponse, IUserLogin } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";
import AuthService from "@/services/auth-service";
import { getPostLoginPath } from "@/utils/auth-utils";
import { showAppToast } from "@/utils/app-toast";
import "./styles.css";

interface LoginPopoverFormValues extends IUserLogin {
  rememberMe: boolean;
}

const defaultValues: LoginPopoverFormValues = {
  email: "",
  password: "",
  rememberMe: true,
};

export function LoginPopover() {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { login } = AuthService;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginPopoverFormValues>({ defaultValues });

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const onSubmit = async (data: LoginPopoverFormValues) => {
    setLoading(true);

    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 && response.data) {
        const authenticationResponse = response.data as AuthenticationResponse;
        await handleLogin(authenticationResponse, data.rememberMe);

        showAppToast({
          severity: "success",
          summary: "Login realizado",
          detail: "Bem-vindo de volta à NEXUS Store.",
          life: 3000,
        });

        setOpen(false);
        reset(defaultValues);

        const redirectPath = getPostLoginPath(authenticationResponse.user);
        if (redirectPath !== "/") {
          navigate(redirectPath);
        }
      } else {
        showAppToast({
          severity: "error",
          summary: "Erro",
          detail: "E-mail ou senha inválidos.",
          life: 3500,
        });
      }
    } catch {
      showAppToast({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível entrar. Tente novamente.",
        life: 3500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popover" ref={containerRef}>
      <Button
        label="Entrar"
        icon="pi pi-sign-in"
        className="p-button-text"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      />

      {open && (
        <div
          className="login-popover__panel"
          role="dialog"
          aria-label="Entrar na conta"
        >
          <h3 className="login-popover__title">Acesse sua conta</h3>

          <form
            className="login-popover__form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="login-popover__field">
              <label htmlFor="popover-email">E-mail</label>
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
                    id="popover-email"
                    {...field}
                    type="email"
                    autoComplete="email"
                    className={errors.email ? "p-invalid w-full" : "w-full"}
                  />
                )}
              />
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
              )}
            </div>

            <div className="login-popover__field">
              <label htmlFor="popover-password">Senha</label>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Informe a senha" }}
                render={({ field }) => (
                  <Password
                    id="popover-password"
                    {...field}
                    toggleMask
                    feedback={false}
                    autoComplete="current-password"
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
                <div className="login-popover__remember">
                  <Checkbox
                    inputId="popover-remember"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.checked ?? false)}
                  />
                  <label htmlFor="popover-remember">Ficar sempre conectado</label>
                </div>
              )}
            />

            <Button
              type="submit"
              label="Entrar"
              icon="pi pi-sign-in"
              className="w-full"
              loading={loading || isSubmitting}
              disabled={loading || isSubmitting}
            />
          </form>

          <p className="login-popover__footer">
            Não tem conta?{" "}
            <Link
              to="/register"
              className="login-popover__link"
              onClick={() => setOpen(false)}
            >
              Criar conta
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
