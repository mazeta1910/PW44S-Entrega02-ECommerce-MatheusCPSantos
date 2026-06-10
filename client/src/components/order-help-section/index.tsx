import { Button } from "primereact/button";
import "./styles.css";

interface OrderHelpSectionProps {
  onRequestHelp?: () => void;
  supportRequestMessage?: string;
}

export function OrderHelpSection({
  onRequestHelp,
  supportRequestMessage,
}: OrderHelpSectionProps) {
  if (supportRequestMessage) {
    return (
      <section className="order-help-section order-help-section--info">
        <span className="order-help-section__icon" aria-hidden>
          <i className="pi pi-info-circle" />
        </span>
        <div className="order-help-section__body">
          <h3>Sua solicitação</h3>
          <p>{supportRequestMessage}</p>
        </div>
      </section>
    );
  }

  if (!onRequestHelp) {
    return null;
  }

  return (
    <section className="order-help-section">
      <span className="order-help-section__icon" aria-hidden>
        <i className="pi pi-question-circle" />
      </span>
      <div className="order-help-section__body">
        <h3>Precisa de ajuda com este pedido?</h3>
        <p>
          Enquanto o pedido ainda não foi enviado, você pode solicitar
          cancelamento, reembolso ou troca.
        </p>
      </div>
      <Button
        type="button"
        label="Solicitar ajuda"
        icon="pi pi-comment"
        outlined
        onClick={onRequestHelp}
      />
    </section>
  );
}
