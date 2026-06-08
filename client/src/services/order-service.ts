import type { IOrder, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const findMyOrders = async (): Promise<IResponse> => {
  try {
    const { status, data } = await api.get("/orders/me");
    return {
      status,
      success: true,
      message: "Pedidos carregados com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: "Falha ao carregar os pedidos",
      data: error.response?.data,
    };
  }
};

const OrderService = {
  findMyOrders,
};

export default OrderService;
export type { IOrder };
