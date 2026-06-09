import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Link, useNavigate } from "react-router-dom";
import type { AuthenticationResponse, IUserLogin } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";
import AuthService from "@/services/auth-service";
import { getPostLoginPath } from "@/utils/auth-utils";
import { Toast } from "primereact/toast";

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLogin & { rememberMe: boolean }>({
    defaultValues: { email: "", password: "", rememberMe: true },
  });
  const navigate = useNavigate();
  const { login } = AuthService;
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  
  const { handleLogin } = useAuth();

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
          navigate(getPostLoginPath(authenticationResponse.user));
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao efetuar login.",
          life: 3000,
        });
      }
    } catch (error) {
      console.log(error);
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
    <div className="flex justify-content-center align-items-center min-h-screen p-4">
      <Toast ref={toast} />
      <Card title="Login" className="w-full sm:w-20rem shadow-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-column gap-3"
        >
          <div>
            <label htmlFor="email" className="block mb-2">
              E-mail
            </label>
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
                  className={errors.email ? "p-invalid w-full" : "w-full"}
                />
              )}
            />
            {errors.email && (
              <small className="p-error">{errors.email.message}</small>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">
              Senha
            </label>
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
              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId="rememberMe"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.checked ?? false)}
                />
                <label htmlFor="rememberMe" className="text-sm cursor-pointer">
                  Ficar sempre conectado
                </label>
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

        <div className="text-center mt-3">
          <small>
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary">
              Criar conta
            </Link>
          </small>
        </div>
      </Card>
    </div>
  );
};
