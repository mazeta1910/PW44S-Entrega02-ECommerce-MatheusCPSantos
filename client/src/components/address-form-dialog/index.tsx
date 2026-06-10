import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import type { IAddress, ICepLookup, IFreightOption } from "@/commons/types";
import AddressService from "@/services/address-service";
import CepService from "@/services/cep-service";
import FreightService from "@/services/freight-service";
import { showAppToast } from "@/utils/app-toast";
import {
  formatZipCodeInput,
  isValidZipCode,
  normalizeZipCode,
} from "@/utils/cep-utils";
import { formatCurrency } from "@/utils/product-utils";
import "./styles.css";

const EMPTY_FORM: Omit<IAddress, "id"> = {
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

type AddressField = keyof Omit<IAddress, "id">;
type FieldErrors = Partial<Record<AddressField, string>>;

interface AddressFormDialogProps {
  visible: boolean;
  onHide: () => void;
  onSaved: (address: IAddress) => void;
  address?: IAddress | null;
}

function FieldLabel({
  htmlFor,
  required,
  optional,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  children: string;
}) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required && (
        <span className="address-form__required" aria-hidden="true">
          {" "}
          *
        </span>
      )}
      {optional && (
        <span className="address-form__optional"> (opcional)</span>
      )}
    </label>
  );
}

function toFormValues(address: IAddress): Omit<IAddress, "id"> {
  return {
    zipCode: address.zipCode,
    street: address.street,
    number: address.number,
    complement: address.complement ?? "",
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
  };
}

export function AddressFormDialog({
  visible,
  onHide,
  onSaved,
  address = null,
}: AddressFormDialogProps) {
  const isEditing = address?.id != null;
  const [form, setForm] = useState<Omit<IAddress, "id">>(EMPTY_FORM);
  const [freightOptions, setFreightOptions] = useState<IFreightOption[]>([]);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [cepFeedback, setCepFeedback] = useState<{
    message: string;
    tone: "error" | "warn";
  } | null>(null);
  const lastAutoLookupRef = useRef<string | null>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFreightOptions([]);
    setFieldErrors({});
    setCepFeedback(null);
    lastAutoLookupRef.current = null;
  };

  const handleHide = () => {
    resetForm();
    onHide();
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (address) {
      setForm(toFormValues(address));
      setFieldErrors({});
      setCepFeedback(null);
      setFreightOptions([]);
      lastAutoLookupRef.current = normalizeZipCode(address.zipCode);
      return;
    }

    resetForm();
  }, [visible, address]);

  const updateField = (field: AddressField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!isValidZipCode(form.zipCode)) {
      errors.zipCode = "Informe um CEP válido com 8 dígitos.";
    }
    if (!form.street.trim()) {
      errors.street = "Informe a rua ou logradouro.";
    }
    if (!form.number.trim()) {
      errors.number = "Informe o número.";
    }
    if (!form.neighborhood.trim()) {
      errors.neighborhood = "Informe o bairro.";
    }
    if (!form.city.trim()) {
      errors.city = "Informe a cidade.";
    }
    if (!form.state.trim() || form.state.trim().length !== 2) {
      errors.state = "Informe a UF com 2 letras.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearchCep = async (zipCode = form.zipCode) => {
    if (!isValidZipCode(zipCode)) {
      setCepFeedback({
        message: "Informe um CEP válido com 8 dígitos.",
        tone: "error",
      });
      setFieldErrors((prev) => ({
        ...prev,
        zipCode: "Informe um CEP válido com 8 dígitos.",
      }));
      return;
    }

    setIsSearchingCep(true);
    setCepFeedback(null);
    setFreightOptions([]);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.zipCode;
      return next;
    });

    const normalizedZip = normalizeZipCode(zipCode);
    const [cepResponse, freightResponse] = await Promise.all([
      CepService.lookup(normalizedZip),
      FreightService.calculate(normalizedZip),
    ]);

    let shouldFocusNumber = false;

    if (cepResponse.success && cepResponse.data) {
      const cepData = cepResponse.data as ICepLookup;
      setForm((prev) => ({
        ...prev,
        zipCode: normalizeZipCode(cepData.zipCode || normalizedZip),
        street:
          cepData.found === false ? prev.street : cepData.street || prev.street,
        neighborhood:
          cepData.found === false
            ? prev.neighborhood
            : cepData.neighborhood || prev.neighborhood,
        city: cepData.city || prev.city,
        state: cepData.state || prev.state,
      }));

      if (cepData.found === false) {
        setCepFeedback({
          message:
            cepResponse.message ??
            "CEP não encontrado na ViaCEP. Preencha rua e bairro manualmente.",
          tone: "warn",
        });
      } else {
        shouldFocusNumber = true;
      }
    } else {
      setCepFeedback({
        message: cepResponse.message ?? "Não foi possível consultar o CEP.",
        tone: "error",
      });
    }

    if (freightResponse.success && Array.isArray(freightResponse.data)) {
      setFreightOptions(freightResponse.data as IFreightOption[]);
    }

    setIsSearchingCep(false);

    if (shouldFocusNumber) {
      numberInputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!visible || !isValidZipCode(form.zipCode) || isSearchingCep) {
      return;
    }

    const normalizedZip = normalizeZipCode(form.zipCode);
    if (lastAutoLookupRef.current === normalizedZip) {
      return;
    }

    lastAutoLookupRef.current = normalizedZip;
    void handleSearchCep(normalizedZip);
  }, [form.zipCode, visible, isSearchingCep]);

  const handleSave = async () => {
    if (!validateForm()) {
      showAppToast({
        severity: "warn",
        summary: "Campos obrigatórios",
        detail: "Revise os campos destacados antes de salvar.",
      });
      return;
    }

    setIsSaving(true);

    const payload: IAddress = {
      ...form,
      id: address?.id,
      zipCode: normalizeZipCode(form.zipCode),
      street: form.street.trim(),
      number: form.number.trim(),
      neighborhood: form.neighborhood.trim(),
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      complement: form.complement?.trim() || undefined,
    };

    const response =
      isEditing && address?.id != null
        ? await AddressService.update(address.id, payload)
        : await AddressService.save(payload);

    setIsSaving(false);

    if (response.success && response.data) {
      showAppToast({
        severity: "success",
        summary: isEditing ? "Endereço atualizado" : "Endereço salvo",
        detail: isEditing
          ? "As alterações foram salvas na sua conta."
          : "O endereço foi adicionado à sua conta.",
      });
      onSaved(response.data as IAddress);
      handleHide();
      return;
    }

    showAppToast({
      severity: "error",
      summary: isEditing ? "Erro ao atualizar" : "Erro ao salvar",
      detail:
        response.message ??
        (isEditing
          ? "Não foi possível atualizar o endereço."
          : "Não foi possível salvar o endereço."),
    });
  };

  return (
    <Dialog
      header={isEditing ? "Editar endereço" : "Adicionar novo endereço"}
      visible={visible}
      onHide={handleHide}
      className="address-form-dialog"
      modal
      draggable={false}
      style={{ width: "min(560px, 96vw)" }}
    >
      <div className="address-form">
        <p className="address-form__intro">
          Informe o CEP para preencher automaticamente o endereço. Campos com{" "}
          <span className="address-form__required">*</span> são obrigatórios.
        </p>

        <div className="address-form__field">
          <FieldLabel htmlFor="address-zip-code" required>
            CEP
          </FieldLabel>
          <div className="address-form__cep-row">
            <InputText
              id="address-zip-code"
              value={form.zipCode}
              onChange={(event) => {
                lastAutoLookupRef.current = null;
                updateField("zipCode", formatZipCodeInput(event.target.value));
              }}
              placeholder="00000-000"
              inputMode="numeric"
              autoComplete="postal-code"
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.zipCode)}
              className={classNames("address-form__cep-input", {
                "p-invalid": fieldErrors.zipCode,
              })}
            />
            <Button
              type="button"
              label="Buscar CEP"
              icon="pi pi-search"
              outlined
              loading={isSearchingCep}
              onClick={() => void handleSearchCep()}
            />
          </div>
          {isSearchingCep && (
            <small className="address-form__status">
              Consultando ViaCEP e calculando frete...
            </small>
          )}
          {cepFeedback && (
            <small
              className={
                cepFeedback.tone === "warn"
                  ? "address-form__warn"
                  : "address-form__error"
              }
            >
              {cepFeedback.message}
            </small>
          )}
          {fieldErrors.zipCode && (
            <small className="address-form__error">{fieldErrors.zipCode}</small>
          )}
          <small className="address-form__hint">
            A busca é feita automaticamente ao completar os 8 dígitos.
          </small>
        </div>

        <div className="address-form__section">
          <h3 className="address-form__section-title">Endereço</h3>

          <div className="address-form__grid">
            <div className="address-form__field address-form__field--wide">
              <FieldLabel htmlFor="address-street" required>
                Rua
              </FieldLabel>
              <InputText
                id="address-street"
                value={form.street}
                onChange={(event) => updateField("street", event.target.value)}
                placeholder="Ex.: Rua das Flores"
                autoComplete="address-line1"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.street)}
                className={classNames({ "p-invalid": fieldErrors.street })}
              />
              {fieldErrors.street && (
                <small className="address-form__error">{fieldErrors.street}</small>
              )}
            </div>

            <div className="address-form__field">
              <FieldLabel htmlFor="address-number" required>
                Número
              </FieldLabel>
              <InputText
                id="address-number"
                ref={numberInputRef}
                value={form.number}
                onChange={(event) => updateField("number", event.target.value)}
                placeholder="Ex.: 123"
                inputMode="numeric"
                autoComplete="address-line2"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.number)}
                className={classNames({ "p-invalid": fieldErrors.number })}
              />
              {fieldErrors.number && (
                <small className="address-form__error">{fieldErrors.number}</small>
              )}
            </div>

            <div className="address-form__field">
              <FieldLabel htmlFor="address-complement" optional>
                Complemento
              </FieldLabel>
              <InputText
                id="address-complement"
                value={form.complement ?? ""}
                onChange={(event) =>
                  updateField("complement", event.target.value)
                }
                placeholder="Apto, bloco, casa..."
                autoComplete="address-line3"
              />
            </div>

            <div className="address-form__field address-form__field--wide">
              <FieldLabel htmlFor="address-neighborhood" required>
                Bairro
              </FieldLabel>
              <InputText
                id="address-neighborhood"
                value={form.neighborhood}
                onChange={(event) =>
                  updateField("neighborhood", event.target.value)
                }
                placeholder="Ex.: Centro"
                autoComplete="address-level3"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.neighborhood)}
                className={classNames({ "p-invalid": fieldErrors.neighborhood })}
              />
              {fieldErrors.neighborhood && (
                <small className="address-form__error">
                  {fieldErrors.neighborhood}
                </small>
              )}
            </div>

            <div className="address-form__field">
              <FieldLabel htmlFor="address-city" required>
                Cidade
              </FieldLabel>
              <InputText
                id="address-city"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="Ex.: Curitiba"
                autoComplete="address-level2"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.city)}
                className={classNames({ "p-invalid": fieldErrors.city })}
              />
              {fieldErrors.city && (
                <small className="address-form__error">{fieldErrors.city}</small>
              )}
            </div>

            <div className="address-form__field address-form__field--state">
              <FieldLabel htmlFor="address-state" required>
                Estado
              </FieldLabel>
              <InputText
                id="address-state"
                value={form.state}
                maxLength={2}
                onChange={(event) =>
                  updateField("state", event.target.value.toUpperCase())
                }
                placeholder="Ex.: PR"
                autoComplete="address-level1"
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.state)}
                className={classNames({ "p-invalid": fieldErrors.state })}
              />
              {fieldErrors.state && (
                <small className="address-form__error">{fieldErrors.state}</small>
              )}
            </div>
          </div>
        </div>

        {freightOptions.length > 0 && (
          <div className="address-form__freight">
            <h3>Opções de frete para este CEP</h3>
            <ul>
              {freightOptions.map((option) => (
                <li key={option.carrierId}>
                  <span>{option.carrierName}</span>
                  <span>
                    {formatCurrency(Number(option.price))} ·{" "}
                    {option.estimatedDays}{" "}
                    {option.estimatedDays === 1 ? "dia útil" : "dias úteis"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="address-form__actions">
          <Button
            type="button"
            label="Cancelar"
            text
            onClick={handleHide}
            disabled={isSaving}
          />
          <Button
            type="button"
            label={isEditing ? "Salvar alterações" : "Salvar endereço"}
            icon="pi pi-check"
            loading={isSaving}
            onClick={() => void handleSave()}
          />
        </div>
      </div>
    </Dialog>
  );
}
