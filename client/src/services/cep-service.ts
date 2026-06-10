import type { ICepLookup, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";
import { normalizeZipCode } from "@/utils/cep-utils";

const lookup = async (zipCode: string): Promise<IResponse> => {
  const normalized = normalizeZipCode(zipCode).replace("-", "");
  let response = {} as IResponse;

  try {
    const { status, data } = await api.get(`/cep/${normalized}`);
    const cepData = data as ICepLookup;

    response = {
      status,
      success: true,
      message: cepData.found === false
        ? "CEP não encontrado na ViaCEP. Preencha rua e bairro manualmente."
        : "CEP encontrado com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as {
      response?: { status?: number; data?: { message?: string } };
    };
    response = {
      status: error.response?.status ?? 0,
      success: false,
      message:
        error.response?.data?.message ??
        "Não foi possível consultar o CEP no momento.",
      data: error.response?.data,
    };
  }

  return response;
};

const CepService = {
  lookup,
};

export default CepService;
export type { ICepLookup };
