import type { IOrder } from "@/commons/types";
import { getOrderTimelineSteps } from "@/utils/order-utils";
import "./styles.css";

interface OrderDeliveryTimelineProps {
  order: IOrder;
}

const STEP_ICONS: Record<string, string> = {
  placed: "pi-shopping-cart",
  payment: "pi-credit-card",
  preparing: "pi-box",
  transit: "pi-truck",
  delivered: "pi-check-circle",
  digital: "pi-cloud-download",
  cancelled: "pi-times-circle",
  refund: "pi-wallet",
  exchange: "pi-refresh",
};

export function OrderDeliveryTimeline({ order }: OrderDeliveryTimelineProps) {
  const steps = getOrderTimelineSteps(order);

  return (
    <section className="order-timeline" aria-label="Acompanhamento do pedido">
      <h3 className="order-timeline__title">Acompanhamento</h3>
      <ol className="order-timeline__track">
        {steps.map((step, index) => {
          const icon = STEP_ICONS[step.id] ?? "pi-circle";
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id}
              className={`order-timeline__step order-timeline__step--${step.state}${
                isLast ? " order-timeline__step--last" : ""
              }`}
            >
              <div className="order-timeline__marker" aria-hidden>
                <span className={`pi ${icon}`} />
              </div>
              <div className="order-timeline__content">
                <strong>{step.label}</strong>
                <span>{step.description}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
