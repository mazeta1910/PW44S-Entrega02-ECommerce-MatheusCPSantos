import type { IFreightOption, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";
import { normalizeZipCode } from "@/utils/cep-utils";

const calculate = async (zipCode: string): Promise<IResponse> => {
  let response = {} as IResponse;

  try {
    const { status, data } = await api.get("/freights/calculate", {
      params: { zipCode: normalizeZipCode(zipCode) },
    });
    response = {
      status,
      success: true,
      message: "Frete calculado com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    response = {
      status: error.response?.status ?? 0,
      success: false,
      message: "Falha ao calcular o frete.",
      data: error.response?.data,
    };
  }

  return response;
};

const FreightService = {
  calculate,
};

export default FreightService;
export type { IFreightOption };
