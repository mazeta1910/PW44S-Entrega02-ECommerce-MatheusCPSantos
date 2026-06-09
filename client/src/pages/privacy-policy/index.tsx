import { Link } from "react-router-dom";
import Footer from "@/components/footer";
import { PageBreadcrumb } from "@/components/breadcrumb";
import "../terms-of-service/styles.css";

const LAST_UPDATED = "9 de junho de 2026";

export function PrivacyPolicyPage() {
  return (
    <div className="page-container">
      <main className="terms-page">
        <PageBreadcrumb
          includeCatalog={false}
          segments={[{ label: "Política de Privacidade" }]}
        />

        <header className="terms-page__header">
          <h1>Política de Privacidade</h1>
          <p className="terms-page__updated">
            Última atualização: {LAST_UPDATED}
          </p>
          <p className="terms-page__intro">
            Esta Política de Privacidade descreve como a{" "}
            <strong>NEXUS Store</strong> trata informações pessoais e dados
            armazenados localmente no navegador. Ela complementa os{" "}
            <Link to="/termos">Termos de Uso</Link> da plataforma.
          </p>
        </header>

        <article className="terms-page__content">
          <section className="terms-section terms-section--notice">
            <h2>
              <i className="pi pi-info-circle" aria-hidden />
              Projeto acadêmico
            </h2>
            <p>
              A NEXUS Store é um projeto desenvolvido na disciplina de
              Programação Web (PW44S) da UTFPR — Câmpus Pato Branco. O
              tratamento de dados ocorre em contexto educacional. Evite
              informar dados sensíveis ou reais além do necessário para testes e
              demonstrações.
            </p>
          </section>

          <section className="terms-section">
            <h2>1. Dados que coletamos</h2>
            <p>Podemos tratar as seguintes categorias de informação:</p>
            <ul>
              <li>
                <strong>Dados de cadastro:</strong> nome, e-mail, CPF,
                telefone, data de nascimento e preferências de newsletter.
              </li>
              <li>
                <strong>Dados de autenticação:</strong> credenciais de acesso e
                token de sessão (JWT) para manter o login.
              </li>
              <li>
                <strong>Dados de pedidos e endereços:</strong> quando
                cadastrados ou utilizados em compras.
              </li>
              <li>
                <strong>Dados de navegação local:</strong> itens do carrinho,
                tema visual e consentimentos exibidos na interface.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>2. Finalidade do tratamento</h2>
            <p>Utilizamos os dados para:</p>
            <ul>
              <li>criar e autenticar contas de usuário;</li>
              <li>processar pedidos, endereços e histórico de compras;</li>
              <li>manter o carrinho e preferências de interface;</li>
              <li>exibir avaliações e informações de produtos;</li>
              <li>cumprir requisitos acadêmicos e de demonstração do sistema.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Cookies e armazenamento local</h2>
            <p>
              A NEXUS Store <strong>não utiliza cookies de rastreamento,
              publicidade ou analytics de terceiros</strong>. Para
              funcionamento básico, o navegador pode armazenar:
            </p>
            <ul>
              <li>
                <strong>localStorage:</strong> token de login, dados do
                usuário, carrinho, tema e aceite do aviso de privacidade;
              </li>
              <li>
                <strong>sessionStorage:</strong> recusa temporária do aviso de
                privacidade na sessão atual.
              </li>
            </ul>
            <p>
              Ao recusar o aviso inicial, ele poderá ser exibido novamente em
              uma nova visita ao site. Ao aceitar, o aviso deixa de ser
              mostrado.
            </p>
          </section>

          <section className="terms-section">
            <h2>4. Compartilhamento de dados</h2>
            <p>
              Os dados informados são processados pela API do próprio projeto.
              Não vendemos nem compartilhamos informações pessoais com
              plataformas de marketing. Integrações externas (como consulta de
              CEP ou cálculo de frete), quando implementadas, serão usadas
              apenas para as finalidades descritas nesta política.
            </p>
          </section>

          <section className="terms-section">
            <h2>5. Segurança</h2>
            <p>
              Adotamos medidas técnicas compatíveis com o escopo do projeto,
              incluindo autenticação por JWT, senhas com hash (BCrypt) no
              servidor e comunicação via API REST. Nenhum sistema é totalmente
              imune a incidentes; em ambiente acadêmico, recomenda-se o uso de
              senhas de teste.
            </p>
          </section>

          <section className="terms-section">
            <h2>6. Seus direitos</h2>
            <p>
              Nos termos da legislação aplicável (incluindo a LGPD), você pode
              solicitar informações sobre seus dados, correção de informações
              incorretas ou exclusão da conta, conforme viabilidade técnica do
              projeto. Na área da conta, é possível atualizar dados pessoais
              quando essa funcionalidade estiver disponível.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Retenção dos dados</h2>
            <p>
              Dados de cadastro e pedidos permanecem no banco enquanto forem
              necessários para o funcionamento e avaliação do sistema. Dados
              locais no navegador podem ser removidos pelo próprio usuário
              limpando o armazenamento do site ou utilizando o modo anônimo.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Menores de idade</h2>
            <p>
              O cadastro observa regras de idade mínima e vínculo com
              responsável legal quando aplicável, conforme validações do
              formulário de registro e regras de negócio do servidor.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Alterações desta política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada para refletir
              mudanças no projeto ou requisitos da disciplina. A data da última
              revisão será indicada no topo desta página.
            </p>
          </section>

          <section className="terms-section">
            <h2>10. Contato</h2>
            <p>
              Para dúvidas sobre privacidade ou tratamento de dados:
            </p>
            <ul className="terms-page__contact">
              <li>
                <i className="pi pi-envelope" aria-hidden />
                E-mail:{" "}
                <a href="mailto:matheuscps110@gmail.com">matheuscps110@gmail.com</a>
              </li>
              <li>
                <i className="pi pi-whatsapp" aria-hidden />
                WhatsApp: (46) 99976-8334
              </li>
            </ul>
          </section>
        </article>

        <footer className="terms-page__actions">
          <Link to="/termos" className="terms-page__link">
            <i className="pi pi-file" aria-hidden />
            Ver Termos de Uso
          </Link>
          <Link to="/register" className="terms-page__link">
            <i className="pi pi-user-plus" aria-hidden />
            Voltar ao cadastro
          </Link>
          <Link to="/" className="terms-page__link terms-page__link--primary">
            <i className="pi pi-home" aria-hidden />
            Ir para a loja
          </Link>
        </footer>
      </main>

      <Footer />
    </div>
  );
}
