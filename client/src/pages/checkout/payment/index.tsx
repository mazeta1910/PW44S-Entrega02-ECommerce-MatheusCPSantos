import { Link, Navigate } from "react-router-dom";
import { Button } from "primereact/button";
import Footer from "@/components/footer";
import { CheckoutStepBar } from "@/components/checkout-step-bar";
import { useAuth } from "@/context/hooks/use-auth";
import { readCartItems } from "@/utils/cart-storage";
import "../styles.css";

export function CheckoutPaymentPage() {
  const { authenticated } = useAuth();
  const cartItems = readCartItems();
  const selectedAddressId = sessionStorage.getItem("checkout_delivery_address_id");

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  if (!authenticated) {
    return <Navigate to="/checkout/identification" replace />;
  }

  if (!selectedAddressId) {
    return <Navigate to="/checkout/identification" replace />;
  }

  return (
    <div className="page-container">
      <main className="checkout-page">
        <div className="checkout-page__container">
          <CheckoutStepBar currentStep={3} />

          <section className="checkout-card">
            <h1 className="checkout-card__title">Pagamento</h1>
            <p className="checkout-card__subtitle">
              Etapa em construção. Aqui entrarão frete, cupom e confirmação do
              pedido.
            </p>

            <div className="checkout-actions">
              <Link to="/checkout/identification">
                <Button
                  type="button"
                  label="Voltar para identificação"
                  icon="pi pi-arrow-left"
                  text
                />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
