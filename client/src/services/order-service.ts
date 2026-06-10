import type { ICheckoutOrderPayload, IOrder, IOrderSupportRequest, IResponse } from "@/commons/types";
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

const findMyOrderById = async (orderId: number): Promise<IResponse> => {
  try {
    const { status, data } = await api.get(`/orders/me/${orderId}`);
    return {
      status,
      success: true,
      message: "Pedido carregado com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: object } };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: "Falha ao carregar o pedido",
      data: error.response?.data,
    };
  }
};

const submitSupportRequest = async (
  orderId: number,
  payload: IOrderSupportRequest,
): Promise<IResponse> => {
  try {
    const { status, data } = await api.post(
      `/orders/me/${orderId}/support-request`,
      payload,
    );
    return {
      status,
      success: true,
      message: "Solicitação registrada com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as {
      response?: { status?: number; data?: { message?: string } };
    };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message:
        error.response?.data?.message ?? "Falha ao registrar a solicitação.",
      data: error.response?.data,
    };
  }
};

const checkout = async (payload: ICheckoutOrderPayload): Promise<IResponse> => {
  try {
    const { status, data } = await api.post("/orders/checkout", payload);
    return {
      status,
      success: true,
      message: "Pedido realizado com sucesso!",
      data,
    };
  } catch (err: unknown) {
    const error = err as {
      response?: { status?: number; data?: { message?: string } };
    };
    return {
      status: error.response?.status ?? 0,
      success: false,
      message: error.response?.data?.message ?? "Falha ao finalizar o pedido.",
      data: error.response?.data,
    };
  }
};

const OrderService = {
  findMyOrders,
  findMyOrderById,
  submitSupportRequest,
  checkout,
};

export default OrderService;
export type { IOrder };
