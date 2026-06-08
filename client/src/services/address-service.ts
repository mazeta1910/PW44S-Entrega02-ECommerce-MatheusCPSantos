import type { IAddress, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const findMyAddresses = async (): Promise<IResponse> => {
  try {
    const { status, data } = await api.get("/addresses/me");
    return {
      status,
      success: true,
      message: "Endereços carregados com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: "Falha ao carregar os endereços",
      data: error.response?.data,
    };
  }
};

const AddressService = {
  findMyAddresses,
};

export default AddressService;
export type { IAddress };
