import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Tag } from "primereact/tag";
import type { IOrder } from "@/commons/types";
import { formatCurrency } from "@/utils/product-utils";
import { getProductImageUrl } from "@/utils/image-utils";
import { getPaymentMethodLabel } from "@/constants/payment-methods";
import {
  getOrderStatusLabel,
  getOrderStatusSeverity,
  orderHasPhysicalItems,
} from "@/utils/order-utils";
import {
  formatAddressLine,
  formatEstimatedDeliveryDate,
} from "@/utils/user-utils";
import "./styles.css";

interface OrderDetailsViewProps {
  order: IOrder;
  showStatus?: boolean;
}

export function OrderDetailsView({ order, showStatus = false }: OrderDetailsViewProps) {
  const itemsSubtotal = useMemo(
    () =>
      order.items?.reduce(
        (total, item) => total + Number(item.subtotal ?? 0),
        0,
      ) ?? 0,
    [order.items],
  );

  const hasPhysicalItems = orderHasPhysicalItems(order);
  const hasDigitalItems =
    order.items?.some((item) => item.deliveryType === "DIGITAL") ?? false;
  const estimatedDelivery = formatEstimatedDeliveryDate(
    order.orderDate,
    order.estimatedDeliveryDays,
  );

  return (
    <div className="order-details">
      {showStatus && (
        <div className="order-details__status-row">
          <Tag
            value={getOrderStatusLabel(order.status)}
            severity={getOrderStatusSeverity(order.status)}
          />
          {order.supportRequestMessage && (
            <p className="order-details__support-message">
              <strong>Sua mensagem:</strong> {order.supportRequestMessage}
            </p>
          )}
        </div>
      )}

      {(hasPhysicalItems || hasDigitalItems) && (
        <section className="order-details__section">
          <h3 className="order-details__title">Entrega</h3>

          {hasPhysicalItems && order.deliveryAddress && (
            <div className="order-details__block">
              <span className="order-details__label">Endereço de entrega</span>
              <strong>
                {order.deliveryAddress.street}, {order.deliveryAddress.number}
              </strong>
              <span>{formatAddressLine(order.deliveryAddress)}</span>
            </div>
          )}

          {hasPhysicalItems && estimatedDelivery && (
            <div className="order-details__delivery">
              <span className="order-details__label">Previsão de entrega</span>
              <strong>{estimatedDelivery}</strong>
              {order.carrierName && order.estimatedDeliveryDays != null && (
                <span>
                  via {order.carrierName} — prazo de {order.estimatedDeliveryDays}{" "}
                  {order.estimatedDeliveryDays === 1 ? "dia útil" : "dias úteis"}
                </span>
              )}
            </div>
          )}

          {hasPhysicalItems && !estimatedDelivery && (
            <p className="order-details__delivery-pending">
              Previsão de entrega em processamento. Atualize a página em instantes.
            </p>
          )}

          {hasDigitalItems && (
            <div className="order-details__digital">
              <span className="pi pi-cloud-download" aria-hidden />
              <div>
                <strong>Produtos digitais</strong>
                <span>
                  Os itens digitais ficam disponíveis na sua conta após a
                  confirmação do pagamento.
                </span>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="order-details__section">
        <h3 className="order-details__title">Pagamento</h3>
        <div className="order-details__block">
          <span className="order-details__label">Forma de pagamento</span>
          <strong>{getPaymentMethodLabel(order.paymentMethod)}</strong>
          <span className="order-details__payment-note">
            Pagamento simulado — confirmação registrada no pedido.
          </span>
        </div>
      </section>

      <section className="order-details__section">
        <h3 className="order-details__title">Itens do pedido</h3>
        <ul className="order-details__items">
          {order.items?.map((item) => {
            const productUrl = item.productId
              ? `/catalog/product/${item.productId}`
              : null;

            return (
            <li
              key={item.id ?? `${item.variantId}-${item.productName}`}
              className="order-details__item"
            >
              <div className="order-details__item-main">
                <div className="order-details__item-thumb">
                  {productUrl ? (
                    <Link to={productUrl} aria-label={`Ver ${item.productName}`}>
                      <img
                        src={getProductImageUrl(item.productImage)}
                        alt={item.productName}
                        loading="lazy"
                      />
                    </Link>
                  ) : (
                    <img
                      src={getProductImageUrl(item.productImage)}
                      alt={item.productName}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="order-details__item-info">
                  {productUrl ? (
                    <Link to={productUrl} className="order-details__item-link">
                      <strong>{item.productName}</strong>
                    </Link>
                  ) : (
                    <strong>{item.productName}</strong>
                  )}
                  {item.variantLabel && (
                    <span className="order-details__item-variant">
                      {item.variantLabel}
                    </span>
                  )}
                  <span className="order-details__item-qty">
                    {item.quantity}x {formatCurrency(Number(item.unitPrice))}
                    {item.deliveryType === "DIGITAL" ? " · Digital" : " · Físico"}
                  </span>
                </div>
              </div>
              <span className="order-details__item-subtotal">
                {formatCurrency(Number(item.subtotal))}
              </span>
            </li>
            );
          })}
        </ul>

        <div className="order-details__summary">
          <div className="order-details__summary-row">
            <span>Subtotal dos produtos</span>
            <span>{formatCurrency(itemsSubtotal)}</span>
          </div>
          {(order.freightPrice ?? 0) > 0 && (
            <div className="order-details__summary-row">
              <span>
                Frete{order.carrierName ? ` (${order.carrierName})` : ""}
              </span>
              <span>{formatCurrency(Number(order.freightPrice))}</span>
            </div>
          )}
          {(order.couponDiscount ?? 0) > 0 && (
            <div className="order-details__summary-row order-details__summary-row--discount">
              <span>Cupom</span>
              <span>- {formatCurrency(Number(order.couponDiscount))}</span>
            </div>
          )}
          {(order.paymentDiscount ?? 0) > 0 && (
            <div className="order-details__summary-row order-details__summary-row--discount">
              <span>Desconto Pix</span>
              <span>- {formatCurrency(Number(order.paymentDiscount))}</span>
            </div>
          )}
          <div className="order-details__summary-row order-details__summary-row--total">
            <span>Total</span>
            <span>{formatCurrency(Number(order.total))}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
