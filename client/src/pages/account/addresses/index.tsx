import { useCallback, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";
import type { IAddress } from "@/commons/types";
import { AddressFormDialog } from "@/components/address-form-dialog";
import AddressService from "@/services/address-service";
import { showAppToast } from "@/utils/app-toast";
import { formatAddressLine } from "@/utils/user-utils";
import {
  applyPrimaryAddress,
  sortAddressesByPrimary,
} from "@/utils/address-utils";
import "./styles.css";

export function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(
    null,
  );
  const [settingPrimaryAddressId, setSettingPrimaryAddressId] = useState<
    number | null
  >(null);

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const response = await AddressService.findMyAddresses();

    if (response.success && Array.isArray(response.data)) {
      setAddresses(sortAddressesByPrimary(response.data as IAddress[]));
    } else {
      setAddresses([]);
      setErrorMessage(
        response.message ?? "Não foi possível carregar seus endereços.",
      );
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  const openCreateDialog = () => {
    setEditingAddress(null);
    setShowAddressDialog(true);
  };

  const openEditDialog = (address: IAddress) => {
    setEditingAddress(address);
    setShowAddressDialog(true);
  };

  const handleDialogHide = () => {
    setShowAddressDialog(false);
    setEditingAddress(null);
  };

  const handleAddressSaved = (address: IAddress) => {
    setAddresses((prev) => {
      if (address.id != null && prev.some((item) => item.id === address.id)) {
        const updated = prev.map((item) =>
          item.id === address.id ? address : item,
        );
        return address.isPrimary
          ? applyPrimaryAddress(updated, address.id)
          : updated;
      }

      if (address.isPrimary && address.id != null) {
        return applyPrimaryAddress([...prev, address], address.id);
      }

      return sortAddressesByPrimary([...prev, address]);
    });
    setErrorMessage(null);
  };

  const handleSetPrimary = async (address: IAddress) => {
    if (address.id == null || address.isPrimary) {
      return;
    }

    setSettingPrimaryAddressId(address.id);

    const response = await AddressService.setPrimary(address.id);
    setSettingPrimaryAddressId(null);

    if (response.success) {
      setAddresses((prev) => applyPrimaryAddress(prev, address.id!));
      showAppToast({
        severity: "success",
        summary: "Endereço principal",
        detail: "Este endereço será usado como padrão nas entregas.",
      });
      return;
    }

    showAppToast({
      severity: "error",
      summary: "Erro ao atualizar",
      detail:
        response.message ?? "Não foi possível definir o endereço principal.",
    });
  };

  const handleDeleteAddress = (address: IAddress) => {
    if (address.id == null) {
      return;
    }

    confirmDialog({
      message: (
        <>
          Deseja excluir o endereço{" "}
          <strong>
            {address.street}, {address.number}
          </strong>
          ? Esta ação não pode ser desfeita.
        </>
      ),
      header: "Excluir endereço",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Excluir",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: async () => {
        setDeletingAddressId(address.id ?? null);

        const response = await AddressService.remove(address.id!);
        setDeletingAddressId(null);

        if (response.success) {
          void loadAddresses();
          showAppToast({
            severity: "success",
            summary: "Endereço excluído",
            detail: "O endereço foi removido da sua conta.",
          });
          return;
        }

        showAppToast({
          severity: "error",
          summary: "Erro ao excluir",
          detail: response.message ?? "Não foi possível excluir o endereço.",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-content-center py-6">
        <ProgressSpinner aria-label="Carregando endereços" />
      </div>
    );
  }

  return (
    <>
      <div className="account-addresses__header">
        <div>
          <h2 className="account-section-title">Meus endereços</h2>
          <p className="account-addresses__subtitle">
            Defina um endereço principal para agilizar checkout e entregas.
          </p>
        </div>
        <Button
          type="button"
          label="Adicionar novo endereço"
          icon="pi pi-plus"
          outlined
          onClick={openCreateDialog}
        />
      </div>

      {errorMessage && addresses.length === 0 ? (
        <div className="account-card account-empty">
          <p>{errorMessage}</p>
          <Button
            type="button"
            label="Tentar novamente"
            icon="pi pi-refresh"
            outlined
            className="mt-3"
            onClick={() => void loadAddresses()}
          />
        </div>
      ) : addresses.length === 0 ? (
        <div className="account-card account-empty">
          <span className="account-empty__icon pi pi-map-marker" aria-hidden />
          <p>Você ainda não cadastrou nenhum endereço.</p>
          <Button
            type="button"
            label="Adicionar primeiro endereço"
            icon="pi pi-plus"
            className="mt-3"
            onClick={openCreateDialog}
          />
        </div>
      ) : (
        <div className="account-list">
          {addresses.map((address) => (
            <article
              key={address.id}
              className={`account-list-item${
                address.isPrimary ? " account-list-item--primary" : ""
              }`}
            >
              <div className="account-list-item__header">
                <div className="account-addresses__title-group">
                  <h3 className="account-list-item__title">
                    {address.street}, {address.number}
                  </h3>
                  {address.isPrimary && (
                    <span className="account-addresses__badge">Principal</span>
                  )}
                </div>
                <div className="account-addresses__actions">
                  {!address.isPrimary && (
                    <Button
                      type="button"
                      label="Definir como principal"
                      icon="pi pi-star"
                      size="small"
                      outlined
                      loading={settingPrimaryAddressId === address.id}
                      onClick={() => void handleSetPrimary(address)}
                    />
                  )}
                  <Button
                    type="button"
                    label="Editar"
                    icon="pi pi-pencil"
                    size="small"
                    outlined
                    onClick={() => openEditDialog(address)}
                  />
                  <Button
                    type="button"
                    label="Excluir"
                    icon="pi pi-trash"
                    size="small"
                    outlined
                    severity="danger"
                    loading={deletingAddressId === address.id}
                    onClick={() => handleDeleteAddress(address)}
                  />
                </div>
              </div>
              <p className="account-list-item__body">
                {formatAddressLine(address)}
              </p>
            </article>
          ))}
        </div>
      )}

      <AddressFormDialog
        visible={showAddressDialog}
        onHide={handleDialogHide}
        onSaved={handleAddressSaved}
        address={editingAddress}
      />
    </>
  );
}
