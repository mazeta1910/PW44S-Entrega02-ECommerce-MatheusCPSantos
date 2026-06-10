import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import {
  acceptCookieConsent,
  dismissCookieConsentForSession,
  shouldShowCookieConsent,
} from "@/utils/cookie-consent";
import "./styles.css";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(shouldShowCookieConsent());
  }, []);

  const handleAccept = () => {
    acceptCookieConsent();
    setIsVisible(false);
  };

  const handleDecline = () => {
    dismissCookieConsentForSession();
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="cookie-consent__panel">
        <div className="cookie-consent__icon" aria-hidden>
          <i className="pi pi-shield" />
        </div>

        <div className="cookie-consent__content">
          <h2 id="cookie-consent-title" className="cookie-consent__title">
            Privacidade e armazenamento local
          </h2>
          <p id="cookie-consent-description" className="cookie-consent__text">
            A NEXUS Store não utiliza cookies de rastreamento ou publicidade.
            Para o funcionamento da loja, podemos salvar preferências no seu
            navegador — como tema visual, itens do carrinho e sessão de login —
            conforme descrito nos{" "}
            <Link to="/termos" className="cookie-consent__link">
              Termos de Uso
            </Link>{" "}
            e na{" "}
            <Link to="/privacidade" className="cookie-consent__link">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="cookie-consent__actions">
          <Button
            label="Recusar"
            severity="secondary"
            outlined
            className="cookie-consent__btn cookie-consent__btn--decline"
            onClick={handleDecline}
          />
          <Button
            label="Entendi"
            icon="pi pi-check"
            className="cookie-consent__btn"
            onClick={handleAccept}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
