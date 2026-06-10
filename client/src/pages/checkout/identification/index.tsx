import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { RadioButton } from "primereact/radiobutton";
import type { IAddress, IUserProfile } from "@/commons/types";
import Footer from "@/components/footer";
import { AddressFormDialog } from "@/components/address-form-dialog";
import { CheckoutStepBar } from "@/components/checkout-step-bar";
import { useAuth } from "@/context/hooks/use-auth";
import AddressService from "@/services/address-service";
import UserService from "@/services/user-service";
import { readCartItems } from "@/utils/cart-storage";
import { sortAddressesByPrimary } from "@/utils/address-utils";
import { readCheckoutAddressId, writeCheckoutAddressId } from "@/utils/checkout-storage";
import { getUserDisplayName } from "@/utils/auth-utils";
import {
  formatAddressLine,
  formatCpf,
  formatPhone,
} from "@/utils/user-utils";
import "../styles.css";

export function CheckoutIdentificationPage() {
  const navigate = useNavigate();
  const { authenticated, authenticatedUser } = useAuth();
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const cartItems = readCartItems();

  const loadAddresses = async () => {
    const response = await AddressService.findMyAddresses();

    if (response.success && Array.isArray(response.data)) {
      const loadedAddresses = sortAddressesByPrimary(response.data as IAddress[]);
      setAddresses(loadedAddresses);

      const storedId = readCheckoutAddressId();
      const storedAddress = loadedAddresses.find(
        (address) => address.id === storedId,
      );
      const primaryAddress = loadedAddresses.find((address) => address.isPrimary);
      const fallbackAddress = loadedAddresses.find((address) => address.id != null);

      setSelectedAddressId(
        storedAddress?.id ?? primaryAddress?.id ?? fallbackAddress?.id ?? null,
      );
      return;
    }

    if (!response.success) {
      setErrorMessage(
        response.message ?? "Não foi possível carregar seus endereços.",
      );
    }
  };

  useEffect(() => {
    if (!authenticated) {
      setIsLoading(false);
      return;
    }

    const loadIdentificationData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const [profileResponse] = await Promise.all([
        UserService.getUserInfo(),
        loadAddresses(),
      ]);

      if (profileResponse.success && profileResponse.data) {
        setProfile(profileResponse.data as IUserProfile);
      }

      setIsLoading(false);
    };

    void loadIdentificationData();
  }, [authenticated]);

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleContinue = () => {
    if (selectedAddressId == null) {
      return;
    }

    writeCheckoutAddressId(selectedAddressId);
    navigate("/checkout/payment");
  };

  const handleAddressSaved = (address: IAddress) => {
    setAddresses((prev) => {
      const next =
        address.id != null && prev.some((item) => item.id === address.id)
          ? prev.map((item) => (item.id === address.id ? address : item))
          : [...prev, address];
      return sortAddressesByPrimary(next);
    });
    setSelectedAddressId(address.id ?? null);
    setErrorMessage(null);
  };

  const loginRedirect = {
    pathname: "/login",
    state: { from: { pathname: "/checkout/identification" } },
  };

  const registerRedirect = {
    pathname: "/register",
    state: { from: { pathname: "/checkout/identification" } },
  };

  return (
    <div className="page-container">
      <main className="checkout-page">
        <div className="checkout-page__container">
          <CheckoutStepBar currentStep={2} />

          {!authenticated ? (
            <section className="checkout-card">
              <h1 className="checkout-card__title">Identificação</h1>
              <p className="checkout-card__subtitle">
                Entre na sua conta ou crie um cadastro para continuar a compra
                com segurança.
              </p>

              <div className="checkout-guest-actions">
                <Link to={loginRedirect}>
                  <Button label="Entrar" icon="pi pi-sign-in" />
                </Link>
                <Link to={registerRedirect}>
                  <Button
                    label="Criar conta"
                    icon="pi pi-user-plus"
                    outlined
                  />
                </Link>
              </div>

              <div className="checkout-actions">
                <Link to="/cart">
                  <Button
                    type="button"
                    label="Voltar ao carrinho"
                    icon="pi pi-arrow-left"
                    text
                  />
                </Link>
              </div>
            </section>
          ) : isLoading ? (
            <div className="flex justify-content-center py-6">
              <ProgressSpinner aria-label="Carregando identificação" />
            </div>
          ) : (
            <>
              <section className="checkout-card">
                <h1 className="checkout-card__title">Seus dados</h1>
                <p className="checkout-card__subtitle">
                  Confira as informações da conta que será usada neste pedido.
                </p>

                <div className="checkout-info-grid">
                  <div className="checkout-info-item">
                    <span className="checkout-info-item__label">Nome</span>
                    <span className="checkout-info-item__value">
                      {profile?.fullName ?? getUserDisplayName(authenticatedUser)}
                    </span>
                  </div>
                  <div className="checkout-info-item">
                    <span className="checkout-info-item__label">E-mail</span>
                    <span className="checkout-info-item__value">
                      {profile?.email ?? authenticatedUser?.email ?? "—"}
                    </span>
                  </div>
                  <div className="checkout-info-item">
                    <span className="checkout-info-item__label">CPF</span>
                    <span className="checkout-info-item__value">
                      {formatCpf(profile?.cpf)}
                    </span>
                  </div>
                  <div className="checkout-info-item">
                    <span className="checkout-info-item__label">Telefone</span>
                    <span className="checkout-info-item__value">
                      {formatPhone(profile?.phone)}
                    </span>
                  </div>
                </div>
              </section>

              <section className="checkout-card">
                <h2 className="checkout-card__title">Endereço de entrega</h2>
                <p className="checkout-card__subtitle">
                  Selecione onde deseja receber os produtos físicos do pedido.
                </p>

                {errorMessage && addresses.length === 0 ? (
                  <div className="checkout-empty-state">
                    <p>{errorMessage}</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="checkout-empty-state">
                    <p>Você ainda não cadastrou nenhum endereço.</p>
                  </div>
                ) : (
                  <div className="checkout-address-list">
                    {addresses.map((address) => {
                      if (address.id == null) {
                        return null;
                      }

                      const inputId = `checkout-address-${address.id}`;
                      const isSelected = selectedAddressId === address.id;

                      return (
                        <label
                          key={address.id}
                          htmlFor={inputId}
                          className={`checkout-address-option${
                            isSelected ? " checkout-address-option--selected" : ""
                          }`}
                        >
                          <RadioButton
                            inputId={inputId}
                            name="checkout-address"
                            value={address.id}
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(address.id ?? null)}
                          />
                          <span className="checkout-address-option__body">
                            <strong className="checkout-address-option__title">
                              {address.street}, {address.number}
                            </strong>
                            <span className="checkout-address-option__line">
                              {formatAddressLine(address)}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}

                <Button
                  type="button"
                  label="Adicionar novo endereço"
                  icon="pi pi-plus"
                  outlined
                  className="checkout-address-add-btn"
                  onClick={() => setShowAddressDialog(true)}
                />
              </section>

              <div className="checkout-actions">
                <Link to="/cart">
                  <Button
                    type="button"
                    label="Voltar ao carrinho"
                    icon="pi pi-arrow-left"
                    text
                  />
                </Link>

                <Button
                  type="button"
                  label="Continuar para pagamento"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  className="checkout-actions__primary"
                  disabled={selectedAddressId == null}
                  onClick={handleContinue}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <AddressFormDialog
        visible={showAddressDialog}
        onHide={() => setShowAddressDialog(false)}
        onSaved={handleAddressSaved}
      />
    </div>
  );
}
