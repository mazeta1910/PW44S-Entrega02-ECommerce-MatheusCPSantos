import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import type { IAddress } from "@/commons/types";
import AddressService from "@/services/address-service";
import { formatAddressLine } from "@/utils/user-utils";

export function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await AddressService.findMyAddresses();

      if (response.success && Array.isArray(response.data)) {
        setAddresses(response.data as IAddress[]);
      } else {
        setAddresses([]);
        setErrorMessage(response.message ?? "Não foi possível carregar seus endereços.");
      }

      setIsLoading(false);
    };

    void loadAddresses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-content-center py-6">
        <ProgressSpinner aria-label="Carregando endereços" />
      </div>
    );
  }

  return (
    <>
      <h2 className="account-section-title">Meus endereços</h2>

      {errorMessage && addresses.length === 0 ? (
        <div className="account-empty">
          <p>{errorMessage}</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="account-card account-empty">
          <span className="account-empty__icon pi pi-map-marker" aria-hidden />
          <p>Você ainda não cadastrou nenhum endereço.</p>
        </div>
      ) : (
        <div className="account-list">
          {addresses.map((address) => (
            <article key={address.id} className="account-list-item">
              <h2 className="account-list-item__title">
                {address.street}, {address.number}
              </h2>
              <p className="account-list-item__body">
                {formatAddressLine(address)}
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
