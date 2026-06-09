import { Link } from "react-router-dom";
import "./styles.css";

const REPOSITORY_URL =
  "https://github.com/mazeta1910/Entrega01-ECommerce-MatheusCPSantos";
const CONTACT_EMAIL = "matheuscps110@gmail.com";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Institucional */}
          <div className="footer-column">
            <h3>Institucional</h3>
            <ul>
              <li>
                <Link to="/">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/">Nossa História</Link>
              </li>
              <li>
                <Link to="/">Trabalhe Conosco</Link>
              </li>
              <li>
                <Link to="/">Sustentabilidade</Link>
              </li>
            </ul>
          </div>

          {/* Ajuda */}
          <div className="footer-column">
            <h3>Ajuda</h3>
            <ul>
              <li>
                <Link to="/">Central de Ajuda</Link>
              </li>
              <li>
                <Link to="/">Como Comprar</Link>
              </li>
              <li>
                <Link to="/">Trocas e Devoluções</Link>
              </li>
              <li>
                <Link to="/termos">Termos de Uso</Link>
              </li>
              <li>
                <Link to="/privacidade">Política de Privacidade</Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="footer-column">
            <h3>Contato</h3>
            <ul>
              <li>SAC: (800) 123 4567</li>
              <li>WhatsApp: (46) 99976-8334</li>
              <li>
                E-mail:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>Horário: Seg-Sex 9h às 18h</li>
            </ul>
          </div>

          {/* Formas de Pagamento */}
          <div className="footer-column">
            <h3>Formas de Pagamento</h3>
            <ul>
              <li>💳 Cartões de Crédito</li>
              <li>📱 Compra Segura</li>
              <li>💰 Pix e Boleto</li>
            </ul>

            <div className="social-links">
              <h4>Siga-nos</h4>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/nexusstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook (demonstração)"
                  aria-label="Facebook (demonstração)"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/nexusstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram (demonstração)"
                  aria-label="Instagram (demonstração)"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/nexusstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="X (demonstração)"
                  aria-label="X (demonstração)"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.454l8.6-9.83L0 1.154h7.594l5.243 6.93L18.901 1.153zM17.5 20.584l1.9-2.723L7.05 3.304l-2.1 2.723L17.5 20.584z" />
                  </svg>
                </a>
                <a
                  href={REPOSITORY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Repositório no GitHub"
                  aria-label="Repositório no GitHub"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>
            © 2026 Nexus Store — Games, periféricos e hardware. Todos os direitos
            reservados.{" "}
            <a
              href={REPOSITORY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-repo-link"
            >
              Repositório no GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
