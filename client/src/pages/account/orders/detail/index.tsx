import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import type { IOrder, IOrderSupportRequest } from "@/commons/types";
import { OrderDetailsView } from "@/components/order-details-view";
import { OrderDeliveryTimeline } from "@/components/order-delivery-timeline";
import { OrderHelpSection } from "@/components/order-help-section";
import { OrderSupportDialog } from "@/components/order-support-dialog";
import OrderService from "@/services/order-service";
import {
  canRequestOrderSupport,
  getOrderStatusLabel,
  getOrderStatusSeverity,
  orderHasPhysicalItems,
} from "@/utils/order-utils";
import { showAppToast } from "@/utils/app-toast";
import { formatCurrency } from "@/utils/product-utils";
import { formatEstimatedDeliveryDate, formatOrderDate } from "@/utils/user-utils";
import "./styles.css";

export function AccountOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const parsedOrderId = Number(orderId);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  const loadOrder = async () => {
    if (!Number.isFinite(parsedOrderId)) {
      setIsLoading(false);
      setErrorMessage("Pedido inválido.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const response = await OrderService.findMyOrderById(parsedOrderId);

    if (response.success && response.data) {
      setOrder(response.data as IOrder);
    } else {
      setOrder(null);
      setErrorMessage(response.message ?? "Não foi possível carregar o pedido.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    void loadOrder();
  }, [parsedOrderId]);

  if (!Number.isFinite(parsedOrderId)) {
    return <Navigate to="/account/orders" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-content-center py-6">
        <ProgressSpinner aria-label="Carregando pedido" />
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="account-order-detail">
        <div className="account-empty">
          <p>{errorMessage ?? "Pedido não encontrado."}</p>
        </div>
        <Link to="/account/orders">
          <Button label="Voltar aos pedidos" icon="pi pi-arrow-left" text />
        </Link>
      </div>
    );
  }

  const estimatedDelivery = formatEstimatedDeliveryDate(
    order.orderDate,
    order.estimatedDeliveryDays,
  );
  const canRequestSupport = canRequestOrderSupport(order.status);

  const handleSupportSubmit = async (payload: IOrderSupportRequest) => {
    if (order.id == null) {
      return false;
    }

    const response = await OrderService.submitSupportRequest(order.id, payload);

    if (response.success && response.data) {
      setOrder(response.data as IOrder);
      showAppToast({
        severity: "success",
        summary: "Solicitação enviada",
        detail: response.message,
      });
      return true;
    }

    showAppToast({
      severity: "error",
      summary: "Solicitação",
      detail: response.message ?? "Não foi possível registrar a solicitação.",
    });
    return false;
  };

  return (
    <div className="account-order-detail">
      <div className="account-order-detail__header">
        <Link to="/account/orders">
          <Button
            type="button"
            label="Voltar aos pedidos"
            icon="pi pi-arrow-left"
            text
            className="account-order-detail__back"
          />
        </Link>

        <div className="account-order-detail__heading">
          <div>
            <div className="account-order-detail__title-row">
              <h2 className="account-section-title">Pedido #{order.id}</h2>
              <Tag
                value={getOrderStatusLabel(order.status)}
                severity={getOrderStatusSeverity(order.status)}
              />
            </div>
            <p className="account-order-detail__meta">
              Realizado em {formatOrderDate(order.orderDate)}
            </p>
          </div>
          <div className="account-order-detail__total">
            <span>Total</span>
            <strong>{formatCurrency(Number(order.total))}</strong>
          </div>
        </div>

        {orderHasPhysicalItems(order) && estimatedDelivery && (
          <p className="account-order-detail__delivery-hint">
            <span className="pi pi-truck" aria-hidden />
            Previsão de entrega: <strong>{estimatedDelivery}</strong>
            {order.carrierName ? ` via ${order.carrierName}` : ""}
          </p>
        )}
      </div>

      <OrderDeliveryTimeline order={order} />

      <OrderDetailsView order={order} />

      <OrderHelpSection
        onRequestHelp={
          canRequestSupport ? () => setShowSupportDialog(true) : undefined
        }
        supportRequestMessage={
          !canRequestSupport ? order.supportRequestMessage : undefined
        }
      />

      {order.id != null && (
        <OrderSupportDialog
          visible={showSupportDialog}
          orderId={order.id}
          onHide={() => setShowSupportDialog(false)}
          onSubmit={handleSupportSubmit}
        />
      )}
    </div>
  );
}
