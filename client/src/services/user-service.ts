import type { IResponse, IUserProfile, IUserProfileUpdate } from "@/commons/types";
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

const updateProfile = async (
  payload: IUserProfileUpdate,
): Promise<IResponse> => {
  try {
    const { status, data } = await api.put("/auth/user-info", payload);
    return {
      status,
      success: true,
      message: "Perfil atualizado com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: "Falha ao atualizar o perfil",
      data: error.response?.data,
    };
  }
};

const UserService = {
  getUserInfo,
  updateProfile,
};

export default UserService;
export type { IUserProfile };
