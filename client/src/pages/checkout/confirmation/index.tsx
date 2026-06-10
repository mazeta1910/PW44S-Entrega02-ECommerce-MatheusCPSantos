import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import type { IOrder, IOrderSupportRequest } from "@/commons/types";
import Footer from "@/components/footer";
import { OrderDetailsView } from "@/components/order-details-view";
import { OrderHelpSection } from "@/components/order-help-section";
import { OrderSupportDialog } from "@/components/order-support-dialog";
import OrderService from "@/services/order-service";
import { clearCheckoutSession } from "@/utils/checkout-storage";
import { writeCartItems } from "@/utils/cart-storage";
import { canRequestOrderSupport } from "@/utils/order-utils";
import { showAppToast } from "@/utils/app-toast";
import { formatOrderDate } from "@/utils/user-utils";
import "./styles.css";

export function CheckoutConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const parsedOrderId = Number(orderId);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(parsedOrderId)) {
      setIsLoading(false);
      setErrorMessage("Pedido inválido.");
      return;
    }

    const loadOrder = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await OrderService.findMyOrderById(parsedOrderId);

      if (response.success && response.data) {
        setOrder(response.data as IOrder);
        writeCartItems([]);
        clearCheckoutSession();
      } else {
        setOrder(null);
        setErrorMessage(response.message ?? "Não foi possível carregar o pedido.");
      }

      setIsLoading(false);
    };

    void loadOrder();
  }, [parsedOrderId]);

  const handleSupportSubmit = async (payload: IOrderSupportRequest) => {
    if (order?.id == null) {
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

  const canRequestSupport = order ? canRequestOrderSupport(order.status) : false;

  if (!Number.isFinite(parsedOrderId)) {
    return <Navigate to="/account/orders" replace />;
  }

  return (
    <div className="page-container">
      <main className="checkout-page order-confirmation-page">
        <div className="checkout-page__container">
          {isLoading ? (
            <div className="flex justify-content-center py-6">
              <ProgressSpinner aria-label="Carregando confirmação do pedido" />
            </div>
          ) : errorMessage || !order ? (
            <section className="checkout-card order-confirmation-card">
              <h1 className="checkout-card__title">Pedido não encontrado</h1>
              <p className="checkout-card__subtitle">{errorMessage}</p>
              <div className="order-confirmation-actions">
                <Link to="/account/orders">
                  <Button label="Ver meus pedidos" icon="pi pi-list" />
                </Link>
              </div>
            </section>
          ) : (
            <>
              <section className="order-confirmation-hero">
                <span
                  className="order-confirmation-hero__icon pi pi-check-circle"
                  aria-hidden
                />
                <div>
                  <h1>Pedido confirmado!</h1>
                  <p>
                    Obrigado pela compra. Seu pedido{" "}
                    <strong>#{order.id}</strong> foi registrado em{" "}
                    {formatOrderDate(order.orderDate)}.
                  </p>
                </div>
              </section>

              <OrderDetailsView order={order} />

              <OrderHelpSection
                onRequestHelp={
                  canRequestSupport ? () => setShowSupportDialog(true) : undefined
                }
                supportRequestMessage={
                  !canRequestSupport ? order.supportRequestMessage : undefined
                }
              />

              <div className="order-confirmation-actions">
                <Link to="/">
                  <Button
                    label="Continuar comprando"
                    icon="pi pi-shopping-bag"
                    outlined
                  />
                </Link>
                <Link to="/account/orders">
                  <Button
                    label="Ver meus pedidos"
                    icon="pi pi-list"
                    className="order-confirmation-actions__primary"
                  />
                </Link>
              </div>

              {order.id != null && (
                <OrderSupportDialog
                  visible={showSupportDialog}
                  orderId={order.id}
                  onHide={() => setShowSupportDialog(false)}
                  onSubmit={handleSupportSubmit}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
