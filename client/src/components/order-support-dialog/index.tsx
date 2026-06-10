import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import type { IOrderSupportRequest, OrderSupportRequestType } from "@/commons/types";
import "./styles.css";

const REQUEST_OPTIONS: { label: string; value: OrderSupportRequestType }[] = [
  { label: "Cancelar pedido", value: "CANCEL" },
  { label: "Solicitar reembolso", value: "REFUND" },
  { label: "Solicitar troca", value: "EXCHANGE" },
];

interface OrderSupportDialogProps {
  visible: boolean;
  orderId: number;
  onHide: () => void;
  onSubmit: (payload: IOrderSupportRequest) => Promise<boolean>;
}

export function OrderSupportDialog({
  visible,
  orderId,
  onHide,
  onSubmit,
}: OrderSupportDialogProps) {
  const [requestType, setRequestType] = useState<OrderSupportRequestType>("CANCEL");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleHide = () => {
    if (isSubmitting) {
      return;
    }
    setRequestType("CANCEL");
    setMessage("");
    setErrorMessage(null);
    onHide();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const success = await onSubmit({
      type: requestType,
      message: message.trim() || undefined,
    });

    setIsSubmitting(false);

    if (success) {
      handleHide();
    } else {
      setErrorMessage("Não foi possível registrar a solicitação. Tente novamente.");
    }
  };

  return (
    <Dialog
      header={`Ajuda com o pedido #${orderId}`}
      visible={visible}
      onHide={handleHide}
      className="order-support-dialog"
      modal
      draggable={false}
      style={{ width: "min(520px, 95vw)" }}
    >
      <p className="order-support-dialog__intro">
        Selecione o tipo de solicitação e, se quiser, descreva o motivo. Nossa equipe
        analisará o pedido o quanto antes.
      </p>

      <label className="order-support-dialog__field">
        <span>Tipo de solicitação</span>
        <Dropdown
          value={requestType}
          options={REQUEST_OPTIONS}
          onChange={(event) => setRequestType(event.value as OrderSupportRequestType)}
          className="w-full"
          disabled={isSubmitting}
        />
      </label>

      <label className="order-support-dialog__field">
        <span>Mensagem (opcional)</span>
        <InputTextarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Descreva o motivo da solicitação..."
          disabled={isSubmitting}
          className="w-full"
        />
      </label>

      {errorMessage && <p className="order-support-dialog__error">{errorMessage}</p>}

      <div className="order-support-dialog__actions">
        <Button
          type="button"
          label="Cancelar"
          text
          onClick={handleHide}
          disabled={isSubmitting}
        />
        <Button
          type="button"
          label="Enviar solicitação"
          icon="pi pi-send"
          loading={isSubmitting}
          onClick={() => void handleSubmit()}
        />
      </div>
    </Dialog>
  );
}
