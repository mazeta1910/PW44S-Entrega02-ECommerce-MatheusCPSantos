import { useNavigate } from "react-router-dom";
import { getCartItemCount } from "@/utils/cart-storage";
import "./styles.css";

export type CheckoutStep = 1 | 2 | 3;

const STEPS: { step: CheckoutStep; label: string; path: string }[] = [
  { step: 1, label: "Carrinho", path: "/cart" },
  { step: 2, label: "Identificação", path: "/checkout/identification" },
  { step: 3, label: "Pagamento", path: "/checkout/payment" },
];

interface CheckoutStepBarProps {
  currentStep: CheckoutStep;
}

export function CheckoutStepBar({ currentStep }: CheckoutStepBarProps) {
  const navigate = useNavigate();
  const hasCartItems = getCartItemCount() > 0;

  const canNavigateTo = (step: CheckoutStep) => {
    if (step === 1) {
      return true;
    }
    return hasCartItems && step <= currentStep;
  };

  return (
    <div className="checkout-step-bar-shell">
      <div className="checkout-step-bar">
        {STEPS.map((item, index) => {
          const isActive = currentStep === item.step;
          const isReachable = canNavigateTo(item.step);

          return (
            <div key={item.step} className="checkout-step-bar__group">
              <button
                type="button"
                className={`checkout-step${isActive ? " checkout-step--active" : ""}${
                  isReachable ? " checkout-step--reachable" : ""
                }`}
                onClick={() => {
                  if (isReachable) {
                    navigate(item.path);
                  }
                }}
                disabled={!isReachable}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="checkout-step__circle">{item.step}</span>
                <span>{item.label}</span>
              </button>

              {index < STEPS.length - 1 && (
                <span className="checkout-step-separator" aria-hidden />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
