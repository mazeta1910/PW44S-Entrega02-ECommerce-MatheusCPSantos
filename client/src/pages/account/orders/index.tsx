import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import type { IOrder } from "@/commons/types";
import OrderService from "@/services/order-service";
import { formatCurrency } from "@/utils/product-utils";
import { formatAddressLine, formatOrderDate } from "@/utils/user-utils";

export function AccountOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await OrderService.findMyOrders();

      if (response.success && Array.isArray(response.data)) {
        setOrders(response.data as IOrder[]);
      } else {
        setOrders([]);
        setErrorMessage(response.message ?? "Não foi possível carregar seus pedidos.");
      }

      setIsLoading(false);
    };

    void loadOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-content-center py-6">
        <ProgressSpinner aria-label="Carregando pedidos" />
      </div>
    );
  }

  return (
    <>
      <h1 className="account-section-title">pedidos</h1>

      {errorMessage && orders.length === 0 ? (
        <div className="account-empty">
          <p>{errorMessage}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="account-card account-empty">
          <span className="account-empty__icon pi pi-shopping-bag" aria-hidden />
          <p>Você ainda não realizou nenhum pedido.</p>
        </div>
      ) : (
        <div className="account-list">
          {orders.map((order) => {
            const itemCount = order.items?.length ?? 0;
            const itemSummary =
              order.items?.map((item) => item.productName).join(", ") ?? "—";

            return (
              <article key={order.id} className="account-list-item">
                <div className="account-list-item__header">
                  <h2 className="account-list-item__title">
                    Pedido #{order.id}
                  </h2>
                  <span className="account-list-item__meta">
                    {formatOrderDate(order.orderDate)}
                  </span>
                </div>
                <p className="account-list-item__body">
                  {itemCount} {itemCount === 1 ? "item" : "itens"} — {itemSummary}
                </p>
                {order.deliveryAddress && (
                  <p className="account-list-item__meta mt-2">
                    Entrega: {formatAddressLine(order.deliveryAddress)}
                  </p>
                )}
                <p className="account-list-item__body mt-2">
                  <strong>Total: {formatCurrency(Number(order.total ?? 0))}</strong>
                </p>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
