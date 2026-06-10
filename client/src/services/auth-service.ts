import type {
  IApiError,
  IUserLogin,
  IUserRegister,
  IResponse,
} from "@/commons/types";
import { api } from "@/lib/axios";

const signup = async (user: IUserRegister): Promise<IResponse> => {
  try {
    const { data } = await api.post("/users", user);
    return {
      status: 201,
      success: true,
      message: "Usuário cadastrado com sucesso",
      data,
    };
  } catch (err: unknown) {
    const error = err as {
      response?: { status?: number; data?: IApiError };
    };

    return {
      status: error.response?.status ?? 400,
      success: false,
      message:
        error.response?.data?.message ?? "Não foi possível cadastrar o usuário.",
      data: error.response?.data,
    };
  }
};

const login = async (user: IUserLogin) => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/login", user);
    response = {
      status: 200,
      success: true,
      message: "Login bem-sucedido",
      data: data.data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { data?: unknown } };
    response = {
      status: 401,
      success: false,
      message: "Usuário ou senha inválidos",
      data: error.response?.data as object | undefined,
    };
  }
  return response;
};

const AuthService = {
  signup,
  login,
};

export default AuthService;
