import type { IOrder, OrderStatus } from "@/commons/types";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
  REFUND_REQUESTED: "Reembolso solicitado",
  EXCHANGE_REQUESTED: "Troca solicitada",
  REFUNDED: "Reembolsado",
  EXCHANGED: "Trocado",
};

const ORDER_STATUS_SEVERITY: Record<
  OrderStatus,
  "success" | "info" | "warning" | "danger" | "secondary"
> = {
  CONFIRMED: "success",
  CANCELLED: "secondary",
  REFUND_REQUESTED: "warning",
  EXCHANGE_REQUESTED: "warning",
  REFUNDED: "info",
  EXCHANGED: "info",
};

export function getOrderStatusLabel(status?: OrderStatus | null): string {
  if (!status) {
    return ORDER_STATUS_LABELS.CONFIRMED;
  }
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function getOrderStatusSeverity(
  status?: OrderStatus | null,
): "success" | "info" | "warning" | "danger" | "secondary" {
  if (!status) {
    return ORDER_STATUS_SEVERITY.CONFIRMED;
  }
  return ORDER_STATUS_SEVERITY[status] ?? "secondary";
}

export function canRequestOrderSupport(status?: OrderStatus | null): boolean {
  return !status || status === "CONFIRMED";
}

export function sortOrdersByNewest(orders: IOrder[]): IOrder[] {
  return [...orders].sort((a, b) => {
    const dateA = a.orderDate ? new Date(`${a.orderDate}T12:00:00`).getTime() : 0;
    const dateB = b.orderDate ? new Date(`${b.orderDate}T12:00:00`).getTime() : 0;

    if (dateB !== dateA) {
      return dateB - dateA;
    }

    return (b.id ?? 0) - (a.id ?? 0);
  });
}

export function orderHasPhysicalItems(order: IOrder): boolean {
  return order.items?.some((item) => item.deliveryType === "PHYSICAL") ?? false;
}

export type OrderTimelineStepState =
  | "completed"
  | "active"
  | "pending"
  | "cancelled";

export interface OrderTimelineStep {
  id: string;
  label: string;
  description: string;
  state: OrderTimelineStepState;
}

export function getOrderTimelineSteps(order: IOrder): OrderTimelineStep[] {
  const status = order.status ?? "CONFIRMED";
  const hasPhysical = orderHasPhysicalItems(order);
  const hasDigital =
    order.items?.some((item) => item.deliveryType === "DIGITAL") ?? false;

  if (status === "CANCELLED") {
    return [
      {
        id: "placed",
        label: "Pedido feito",
        description: "Seu pedido foi registrado.",
        state: "completed",
      },
      {
        id: "cancelled",
        label: "Pedido cancelado",
        description: "A compra foi cancelada.",
        state: "cancelled",
      },
    ];
  }

  if (status === "REFUND_REQUESTED") {
    return [
      {
        id: "placed",
        label: "Pedido feito",
        description: "Seu pedido foi registrado.",
        state: "completed",
      },
      {
        id: "payment",
        label: "Pagamento confirmado",
        description: "Pagamento recebido pela loja.",
        state: "completed",
      },
      {
        id: "refund",
        label: "Reembolso solicitado",
        description: "Aguardando análise da equipe.",
        state: "active",
      },
    ];
  }

  if (status === "REFUNDED") {
    return [
      {
        id: "placed",
        label: "Pedido feito",
        description: "Seu pedido foi registrado.",
        state: "completed",
      },
      {
        id: "payment",
        label: "Pagamento confirmado",
        description: "Pagamento recebido pela loja.",
        state: "completed",
      },
      {
        id: "refund",
        label: "Reembolsado",
        description: "Valor devolvido ao cliente.",
        state: "completed",
      },
    ];
  }

  if (status === "EXCHANGE_REQUESTED") {
    return [
      {
        id: "placed",
        label: "Pedido feito",
        description: "Seu pedido foi registrado.",
        state: "completed",
      },
      {
        id: "payment",
        label: "Pagamento confirmado",
        description: "Pagamento recebido pela loja.",
        state: "completed",
      },
      {
        id: "exchange",
        label: "Troca solicitada",
        description: "Aguardando análise da equipe.",
        state: "active",
      },
    ];
  }

  if (status === "EXCHANGED") {
    return [
      {
        id: "placed",
        label: "Pedido feito",
        description: "Seu pedido foi registrado.",
        state: "completed",
      },
      {
        id: "payment",
        label: "Pagamento confirmado",
        description: "Pagamento recebido pela loja.",
        state: "completed",
      },
      {
        id: "exchange",
        label: "Troca concluída",
        description: "Produto substituído com sucesso.",
        state: "completed",
      },
    ];
  }

  if (hasPhysical) {
    return [
      {
        id: "placed",
        label: "Pedido feito",
        description: "Compra registrada com sucesso.",
        state: "completed",
      },
      {
        id: "payment",
        label: "Pagamento confirmado",
        description: "Pagamento aprovado no checkout.",
        state: "completed",
      },
      {
        id: "preparing",
        label: "Preparando envio",
        description: "Separando itens para despacho.",
        state: "active",
      },
      {
        id: "transit",
        label: "Em transporte",
        description: order.carrierName
          ? `A caminho via ${order.carrierName}.`
          : "Aguardando coleta da transportadora.",
        state: "pending",
      },
      {
        id: "delivered",
        label: "Entregue",
        description: "Pedido recebido no endereço informado.",
        state: "pending",
      },
    ];
  }

  if (hasDigital) {
    return [
      {
        id: "placed",
        label: "Pedido feito",
        description: "Compra registrada com sucesso.",
        state: "completed",
      },
      {
        id: "payment",
        label: "Pagamento confirmado",
        description: "Pagamento aprovado no checkout.",
        state: "completed",
      },
      {
        id: "digital",
        label: "Disponível na conta",
        description: "Acesse os itens digitais na sua área do cliente.",
        state: "active",
      },
    ];
  }

  return [
    {
      id: "placed",
      label: "Pedido feito",
      description: "Compra registrada com sucesso.",
      state: "completed",
    },
    {
      id: "payment",
      label: "Pagamento confirmado",
      description: "Pagamento aprovado no checkout.",
      state: "completed",
    },
  ];
}
