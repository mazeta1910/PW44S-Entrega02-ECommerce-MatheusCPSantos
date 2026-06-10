import { Link } from "react-router-dom";
import Footer from "@/components/footer";
import { PageBreadcrumb } from "@/components/breadcrumb";
import "./styles.css";

const LAST_UPDATED = "9 de junho de 2026";

export function TermsOfServicePage() {
  return (
    <div className="page-container">
      <main className="terms-page">
        <PageBreadcrumb
          includeCatalog={false}
          segments={[{ label: "Termos de Uso" }]}
        />

        <header className="terms-page__header">
          <h1>Termos de Uso</h1>
          <p className="terms-page__updated">
            Última atualização: {LAST_UPDATED}
          </p>
          <p className="terms-page__intro">
            Bem-vindo à <strong>NEXUS Store</strong>. Ao acessar ou utilizar
            nossa plataforma, você concorda com as condições descritas neste
            documento. Recomendamos a leitura integral antes de criar uma conta
            ou realizar compras.
          </p>
        </header>

        <article className="terms-page__content">
          <section className="terms-section terms-section--notice">
            <h2>
              <i className="pi pi-info-circle" aria-hidden />
              Natureza acadêmica do projeto
            </h2>
            <p>
              A NEXUS Store é uma aplicação desenvolvida no âmbito da disciplina
              de Programação Web (PW44S) da UTFPR — Câmpus Pato Branco, pelos
              acadêmicos <strong>Matheus C. P. Santos</strong> e{" "}
              <strong>Isacar Freitas</strong>. Embora a interface reproduza a
              experiência de um e-commerce real, trata-se de um{" "}
              <strong>ambiente educacional</strong> para fins de aprendizado,
              avaliação e demonstração de integração entre front-end e API REST.
            </p>
            <p>
              Transações, entregas, suporte e demais operações comerciais podem
              ser simuladas ou limitadas conforme o estágio de desenvolvimento
              do projeto. Não utilize dados reais de pagamento ou informações
              sensíveis além do necessário para testes acadêmicos.
            </p>
          </section>

          <section className="terms-section">
            <h2>1. Aceitação dos termos</h2>
            <p>
              Ao navegar no site, cadastrar-se ou utilizar qualquer funcionalidade
              da NEXUS Store, você declara ter lido, compreendido e aceito estes
              Termos de Uso. Caso não concorde com qualquer disposição, não
              utilize a plataforma.
            </p>
            <p>
              O cadastro exige a marcação explícita de concordância com estes
              termos, conforme exigido no formulário de registro.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Cadastro e conta do usuário</h2>
            <ul>
              <li>
                O cadastro é pessoal e intransferível. Você é responsável pela
                veracidade dos dados informados (nome, e-mail, CPF, telefone e
                demais campos).
              </li>
              <li>
                O e-mail cadastrado deve ser único na plataforma e utilizado
                como identificador de acesso.
              </li>
              <li>
                Menores de idade devem observar as regras de cadastro previstas
                no sistema, incluindo a necessidade de informar responsável
                legal quando aplicável.
              </li>
              <li>
                Você é responsável por manter a confidencialidade da senha e por
                todas as atividades realizadas em sua conta.
              </li>
              <li>
                Em caso de uso indevido ou suspeita de acesso não autorizado,
                recomenda-se alterar a senha e entrar em contato pelos canais
                indicados neste documento.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Produtos, variações e preços</h2>
            <p>
              A vitrine apresenta jogos, periféricos e hardware com informações
              de descrição, imagens, avaliações, preços e variações (plataforma,
              condição do item, tipo de entrega digital ou física).
            </p>
            <ul>
              <li>
                Preços, promoções e disponibilidade podem ser alterados sem
                aviso prévio, respeitando o valor confirmado no momento da
                finalização do pedido, quando essa etapa estiver disponível.
              </li>
              <li>
                Produtos marcados como esgotados ou inativos não podem ser
                adicionados ao carrinho.
              </li>
              <li>
                Conteúdos classificados como +18 exigem atenção à classificação
                indicativa e à legislação vigente.
              </li>
              <li>
                Imagens e descrições têm caráter ilustrativo e podem sofrer
                ajustes para fins de demonstração acadêmica.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. Carrinho, pedidos e pagamento</h2>
            <p>
              Visitantes podem adicionar itens ao carrinho sem autenticação, com
              persistência local no navegador. A finalização de compras pode
              exigir login e demais etapas de checkout conforme evolução do
              projeto.
            </p>
            <ul>
              <li>
                O resumo do pedido deve ser conferido antes da confirmação.
              </li>
              <li>
                Simulações de frete, cupons e formas de pagamento podem não
                representar integrações reais com operadoras ou gateways.
              </li>
              <li>
                Pedidos confirmados, quando implementados, ficarão disponíveis
                no histórico da conta do usuário autenticado.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Entrega e produtos digitais</h2>
            <p>
              Produtos digitais (chaves, códigos ou acessos) e itens físicos
              seguem regras distintas de entrega, descritas na página de cada
              produto.
            </p>
            <ul>
              <li>
                <strong>Entrega digital:</strong> após confirmação do pagamento,
                o acesso ou a chave pode ser disponibilizado por e-mail em prazo
                estimado informado na página do produto.
              </li>
              <li>
                <strong>Entrega física:</strong> prazos dependem de CEP,
                transportadora e disponibilidade de estoque; produtos usados ou
                semi-novos podem passar por verificação prévia ao envio.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. Trocas, devoluções e cancelamentos</h2>
            <p>
              Solicitações de troca, devolução ou cancelamento devem observar o
              Código de Defesa do Consumidor e as políticas específicas de cada
              tipo de produto (digital ou físico). Em ambiente acadêmico, tais
              fluxos podem ser demonstrados de forma simplificada.
            </p>
            <p>
              Em caso de dúvidas, utilize os canais de contato listados no rodapé
              do site.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Avaliações e conteúdo do usuário</h2>
            <p>
              Avaliações e comentários devem ser respeitosos, verídicos e
              relacionados à experiência com o produto adquirido. É proibido
              publicar conteúdo ofensivo, discriminatório, ilegal ou que viole
              direitos de terceiros.
            </p>
            <p>
              A NEXUS Store reserva-se o direito de moderar, ocultar ou remover
              conteúdos que contrariem estas diretrizes, dentro dos limites
              técnicos do sistema.
            </p>
          </section>

          <section className="terms-section">
            <h2>8. Propriedade intelectual</h2>
            <p>
              Marcas, logotipos, layout, textos e código-fonte desenvolvidos
              para o projeto pertencem aos respectivos autores ou licenciadores.
              Imagens de produtos e marcas de terceiros são utilizadas para fins
              educacionais e de demonstração.
            </p>
            <p>
              É vedada a reprodução, distribuição ou exploração comercial do
              conteúdo da plataforma sem autorização, salvo nos casos permitidos
              pela legislação ou pelo enunciado acadêmico.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Privacidade e proteção de dados</h2>
            <p>
              Dados pessoais informados no cadastro e no uso da plataforma são
              tratados para viabilizar autenticação, pedidos, endereços e
              comunicações relacionadas ao serviço. Recomenda-se não inserir
              informações desnecessárias em ambiente de testes.
            </p>
            <p>
              Detalhes adicionais sobre coleta, uso e armazenamento estão
              descritos na{" "}
              <Link to="/privacidade">Política de Privacidade</Link>.
            </p>
          </section>

          <section className="terms-section">
            <h2>10. Limitação de responsabilidade</h2>
            <p>
              Na medida permitida pela lei e compatível com a natureza acadêmica
              do projeto, a NEXUS Store não se responsabiliza por:
            </p>
            <ul>
              <li>
                indisponibilidade temporária decorrente de manutenção, falhas de
                rede ou ambiente de desenvolvimento;
              </li>
              <li>
                inconsistências em dados de demonstração ou seeds de banco de
                dados;
              </li>
              <li>
                danos indiretos decorrentes do uso da plataforma em contexto de
                avaliação universitária.
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>11. Alterações destes termos</h2>
            <p>
              Estes Termos de Uso podem ser atualizados a qualquer momento para
              refletir mudanças no escopo do projeto, requisitos da disciplina ou
              melhorias na aplicação. A data da última revisão será indicada no
              topo desta página.
            </p>
          </section>

          <section className="terms-section">
            <h2>12. Contato</h2>
            <p>
              Para dúvidas sobre estes termos ou sobre o funcionamento da
              plataforma:
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
              <li>
                <i className="pi pi-clock" aria-hidden />
                Horário de atendimento: segunda a sexta, 9h às 18h
              </li>
            </ul>
          </section>
        </article>

        <footer className="terms-page__actions">
          <Link to="/privacidade" className="terms-page__link">
            <i className="pi pi-shield" aria-hidden />
            Ver Política de Privacidade
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
