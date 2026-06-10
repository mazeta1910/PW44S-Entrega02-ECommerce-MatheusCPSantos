import type { ICouponValidation, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const validate = async (code: string, subtotal: number): Promise<IResponse> => {
  try {
    const { status, data } = await api.get("/coupons/validate", {
      params: { code: code.trim(), subtotal },
    });
    return {
      status,
      success: true,
      message: (data as ICouponValidation).message ?? "Cupom validado.",
      data,
    };
  } catch (err: unknown) {
    const error = err as {
      response?: { status?: number; data?: { message?: string } };
    };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: error.response?.data?.message ?? "Falha ao validar o cupom.",
      data: error.response?.data,
    };
  }
};

const CouponService = {
  validate,
};

export default CouponService;
