import type { IAddress, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

function extractErrorMessage(err: unknown, fallback: string): string {
  const error = err as {
    response?: { data?: { message?: string } };
  };
  return error.response?.data?.message ?? fallback;
}

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
      message: extractErrorMessage(err, "Falha ao carregar os endereços"),
      data: error.response?.data,
    };
  }
};

const save = async (address: IAddress): Promise<IResponse> => {
  try {
    const { status, data } = await api.post("/addresses", address);
    return {
      status,
      success: true,
      message: "Endereço salvo com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: extractErrorMessage(err, "Falha ao salvar o endereço"),
      data: error.response?.data,
    };
  }
};

const update = async (id: number, address: IAddress): Promise<IResponse> => {
  try {
    const { status, data } = await api.put(`/addresses/${id}`, {
      ...address,
      id,
    });
    return {
      status,
      success: true,
      message: "Endereço atualizado com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: extractErrorMessage(err, "Falha ao atualizar o endereço"),
      data: error.response?.data,
    };
  }
};

const remove = async (id: number): Promise<IResponse> => {
  try {
    const { status } = await api.delete(`/addresses/${id}`);
    return {
      status,
      success: true,
      message: "Endereço excluído com sucesso!",
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: extractErrorMessage(err, "Falha ao excluir o endereço"),
      data: error.response?.data,
    };
  }
};

const setPrimary = async (id: number): Promise<IResponse> => {
  try {
    const { status, data } = await api.patch(`/addresses/${id}/primary`);
    return {
      status,
      success: true,
      message: "Endereço principal atualizado com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: extractErrorMessage(err, "Falha ao definir endereço principal"),
      data: error.response?.data,
    };
  }
};

const AddressService = {
  findMyAddresses,
  save,
  update,
  remove,
  setPrimary,
};

export default AddressService;
export type { IAddress };
