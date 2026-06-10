import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import type { IOrder } from "@/commons/types";
import OrderService from "@/services/order-service";
import {
  getOrderStatusLabel,
  getOrderStatusSeverity,
  orderHasPhysicalItems,
  sortOrdersByNewest,
} from "@/utils/order-utils";
import { formatCurrency } from "@/utils/product-utils";
import {
  formatEstimatedDeliveryDate,
  formatOrderDate,
} from "@/utils/user-utils";
import "./styles.css";

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
        setOrders(sortOrdersByNewest(response.data as IOrder[]));
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
      <h2 className="account-section-title">Meus pedidos</h2>

      {errorMessage && orders.length === 0 ? (
        <div className="account-empty">
          <p>{errorMessage}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="account-card account-empty">
          <span className="account-empty__icon pi pi-shopping-bag" aria-hidden />
          <p>Você ainda não realizou nenhum pedido.</p>
          <Link to="/catalog">
            <Button label="Explorar catálogo" icon="pi pi-search" className="mt-3" />
          </Link>
        </div>
      ) : (
        <div className="account-orders-list">
          {orders.map((order) => {
            const itemCount = order.items?.length ?? 0;
            const itemSummary =
              order.items?.map((item) => item.productName).join(", ") ?? "—";
            const estimatedDelivery = formatEstimatedDeliveryDate(
              order.orderDate,
              order.estimatedDeliveryDays,
            );

            return (
              <article key={order.id} className="account-order-card">
                <div className="account-order-card__header">
                  <div>
                    <div className="account-order-card__title-row">
                      <h3 className="account-order-card__title">
                        Pedido #{order.id}
                      </h3>
                      <Tag
                        value={getOrderStatusLabel(order.status)}
                        severity={getOrderStatusSeverity(order.status)}
                      />
                    </div>
                    <span className="account-order-card__date">
                      {formatOrderDate(order.orderDate)}
                    </span>
                  </div>
                  <strong className="account-order-card__total">
                    {formatCurrency(Number(order.total ?? 0))}
                  </strong>
                </div>

                <p className="account-order-card__items">
                  {itemCount} {itemCount === 1 ? "item" : "itens"} — {itemSummary}
                </p>

                {orderHasPhysicalItems(order) && estimatedDelivery && (
                  <p className="account-order-card__delivery">
                    <span className="pi pi-truck" aria-hidden />
                    Entrega prevista para{" "}
                    <strong>{estimatedDelivery}</strong>
                    {order.carrierName ? ` via ${order.carrierName}` : ""}
                  </p>
                )}

                <div className="account-order-card__actions">
                  <Link to={`/account/orders/${order.id}`}>
                    <Button
                      label="Ver detalhes"
                      icon="pi pi-eye"
                      outlined
                      size="small"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
