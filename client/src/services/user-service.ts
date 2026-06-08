import type { IResponse, IUserProfile } from "@/commons/types";
import { api } from "@/lib/axios";

const getUserInfo = async (): Promise<IResponse> => {
  try {
    const { status, data } = await api.get("/auth/user-info");
    return {
      status,
      success: true,
      message: "Dados do usuário carregados com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: "Falha ao carregar os dados do usuário",
      data: error.response?.data,
    };
  }
};

const UserService = {
  getUserInfo,
};

export default UserService;
export type { IUserProfile };
