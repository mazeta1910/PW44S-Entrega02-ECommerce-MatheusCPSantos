# NEXUS Store — Comércio Eletrônico (PW44S - Turma 4SI)

**Desenvolvedores:** Matheus C. P. Santos e Isacar Freitas  
**Instituição:** UTFPR — Câmpus Pato Branco  
**Branch:** `Entrega02`  
**Repositório:** [github.com/mazeta1910/Entrega01-ECommerce-MatheusCPSantos](https://github.com/mazeta1910/Entrega01-ECommerce-MatheusCPSantos)  
**Contato:** matheuscps110@gmail.com

---

## Sobre o projeto

A **NEXUS Store** é uma aplicação web de comércio eletrônico desenvolvida como projeto da disciplina de Programação Web. A solução é dividida em:

- **Servidor:** API REST com Spring Boot, persistência em banco de dados e autenticação JWT.
- **Cliente:** SPA em React com consumo da API, vitrine pública e fluxos autenticados.

O escopo segue o enunciado da disciplina: catálogo acessível sem login, página individual de produto, carrinho persistente para visitantes, cadastro/autenticação para finalização de compra, gestão de endereços, checkout com confirmação e histórico de pedidos.

---

## Estrutura do repositório

```
Entrega01-ECommerce-MatheusCPSantos/
├── client/          # Front-end React + Vite + PrimeReact
├── server/          # Back-end Spring Boot + H2/PostgreSQL
└── README.md
```

Documentação complementar:

- `server/README.md` — detalhes da API e endpoints
- `client/readme.md` — guia do projeto React

---

## Tecnologias

| Camada | Stack |
|--------|--------|
| **Back-end** | Java 25, Spring Boot 4.x, Spring Security, JWT, MapStruct, Lombok, H2 (dev) / PostgreSQL |
| **Front-end** | React 19, TypeScript, Vite 8, React Router 7, PrimeReact, Axios, React Hook Form |
| **Ferramentas** | Git, Maven, npm, Postman/Insomnia |

---

## Como executar

### Pré-requisitos

- JDK 25 (ou compatível com o `pom.xml`)
- Node.js 20+
- Maven (ou use o wrapper `./mvnw`)

### Servidor (API)

```bash
cd server
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run
```

- API: `http://localhost:8080`
- Console H2: `http://localhost:8080/h2-console`  
  - JDBC: `jdbc:h2:mem:testdb`

Os dados iniciais (categorias, produtos, usuários, endereços e pedidos) são carregados via `server/src/main/resources/import.sql`.

### Cliente (React)

```bash
cd client
npm install
npm run dev
```

Build de produção (validação TypeScript + bundle):

```bash
npm run build
npm run preview   # opcional: visualizar a build localmente
```

- Aplicação: `http://localhost:5173`
- A API é acessada em `http://localhost:8080` (configurável por `VITE_API_BASE_URL`)

> Execute **servidor e cliente** ao mesmo tempo para testar a integração completa.

> **Nota:** o H2 está configurado com `ddl-auto=create-drop` — ao reiniciar o servidor, os dados do banco são recriados a partir do `import.sql`.

## Funcionalidades — Entrega final

Status alinhado ao enunciado da disciplina (cliente React + servidor integrados).

### Requisitos mínimos

| Requisito | Back-end | Front-end |
|-----------|:--------:|:---------:|
| Página com lista de produtos (nome, valor, imagem) | ✅ | ✅ |
| Página individual do produto (detalhes + adicionar ao carrinho) | ✅ | ✅ |
| Carrinho de compras (quantidade, remover item, esvaziar) | ✅ | ✅ |
| Cadastro de usuário (e-mail único) | ✅ | ✅ |
| Autenticação (login) | ✅ | ✅ |
| Resumo da compra e finalização enviada ao servidor | ✅ | ✅ |
| Catálogo, produto e carrinho acessíveis sem login | ✅ | ✅ |

### Requisitos extras

| Requisito | Back-end | Front-end |
|-----------|:--------:|:---------:|
| Histórico de pedidos do usuário | ✅ | ✅ |
| Filtro de produtos por categoria | ✅ | ✅ |
| Paginação na listagem de produtos | ✅ | ✅ |
| Múltiplos endereços por usuário | ✅ | ✅ |
| Consulta de CEP (ViaCEP) | ✅ | ✅ |
| Cálculo de frete (simulação por região/CEP) | ✅ | ✅ |

**Legenda:** ✅ implementado

### Fluxo de compra (ponta a ponta)

1. **Visitante** navega pelo catálogo, adiciona itens ao carrinho (`localStorage`).
2. No **carrinho**: informa CEP, consulta opções de frete, aplica cupom (opcional) e segue para checkout.
3. **Identificação** (`/checkout/identification`): login/cadastro ou confirmação de dados; escolha do endereço de entrega.
4. **Pagamento** (`/checkout/payment`): revisão de itens, frete, cupom e total; finalização via `POST /orders/checkout`.
5. **Confirmação** (`/checkout/confirmation/:orderId`): resumo do pedido registrado; carrinho e sessão de checkout limpos.
6. **Conta** (`/account/orders`): histórico e detalhe com timeline de entrega e solicitação de ajuda (cancelamento/reembolso/troca).

### O que está disponível no cliente

#### Vitrine e navegação
- **Home** com destaques, categorias e carrossel promocional.
- **Catálogo** paginado com filtros por categoria, plataforma, condição e tipo de entrega.
- **Breadcrumb** contextual nas páginas de catálogo e produto.
- **Tema claro/escuro** com persistência em `localStorage`.
- **Menu da loja** com busca, categorias, carrinho (também para visitantes) e área da conta.

#### Cards e listagem de produtos
- **`ProductCard`** com imagem, badges (condição, desconto, variações), título, avaliação, preço promocional e botão de adicionar ao carrinho.
- Exibição de **avaliação média** e quantidade de reviews (`ProductRating`).
- Layout compacto do card com espaçamento equilibrado entre título, estrelas e preço.

#### Página de produto (`/catalog/product/:id`)
- Layout clássico de e-commerce: **imagem + área de compra** no topo e **abas em largura total** abaixo.
- Informações de compra: categoria, título, avaliação, preço (com `listPrice`), seleção de variação, botões **Adicionar ao carrinho**, **Comprar agora** e voltar ao catálogo.
- Abas **Sobre** (descrição, especificações e entrega) e **Avaliações** (`ProductReviewsPanel`).
- Seção de **itens semelhantes** da mesma categoria, centralizada.
- Bloco de compra com comportamento **sticky** ao rolar a página.

#### Seletor de variações (`ProductVariantPicker`)
- Modo **adaptativo** conforme a quantidade de opções:
  - **Até 3 variações:** cards compactos em grid; detalhes exibidos apenas na opção selecionada.
  - **4 ou mais variações:** `Dropdown` agrupado (Digital/Físico · plataforma) com label e preço; linha de detalhes da seleção abaixo.
- Agrupamento por tipo de entrega e plataforma; itens esgotados desabilitados.

#### Carrinho, checkout e cupons
- **Carrinho** com persistência em `localStorage` para visitantes.
- Componentes reutilizáveis `AddToCartFlow` e `BuyNowFlow`.
- **CEP e frete** integrados no carrinho (`GET /freights/calculate`).
- **Cupons** validados no servidor (`GET /coupons/validate`); desconto recalculado no checkout.
- Regra de **uso único por usuário** por cupom (pedidos cancelados liberam reutilização).
- Checkout em três etapas: identificação → pagamento → confirmação.

#### Conta do usuário (`/account`)
- **Layout de conta** com menu lateral (perfil, pedidos, endereços).
- **Perfil:** visualização e edição de dados (`PUT /auth/profile`), avatar customizável.
- **Pedidos:** listagem (`GET /orders/me`) e detalhe com timeline (`OrderDeliveryTimeline`), previsão de entrega e card de ajuda.
- **Endereços:** CRUD completo com ViaCEP, endereço principal e preview de frete no dialog.

#### Autenticação e administração
- Login, registro e sessão JWT com `AuthContext`.
- **Painel administrativo** e CRUD de categorias/produtos (perfil `ADMIN`).

#### Documentos legais e suporte
- **Termos de Uso** (`/termos`) e **Política de Privacidade** (`/privacidade`).
- **Aviso de cookies/privacidade** no primeiro acesso.
- **Widget de suporte** (chat fictício) no canto inferior direito.
- Links no rodapé e aceite no formulário de cadastro.

### Melhorias de UI/UX

| Área | O que foi feito |
|------|-----------------|
| **ProductCard** | Espaçamento equilibrado entre título, estrelas e preço. |
| **Página de produto** | Layout **2 colunas + abas full width**; container centralizado. |
| **Variações** | Seletor adaptativo (cards vs. dropdown) para produtos com muitas opções. |
| **Login** | Layout em duas colunas com painel de marca. |
| **Detalhe do pedido** | Timeline de acompanhamento e card "Precisa de ajuda?" no rodapé. |
| **Build** | Projeto compila com `npm run build` (TypeScript + Vite). |

## API REST — visão geral

Principais recursos expostos pelo servidor:

| Recurso | Endpoints principais |
|---------|----------------------|
| Autenticação | `POST /login`, `GET /auth/user-info`, `PUT /auth/profile` |
| Usuários | `POST /users` |
| Categorias | CRUD em `/categories` |
| Produtos | CRUD em `/products`, `GET /products/catalog`, `GET /products/by-category/{id}` |
| Variações | CRUD em `/product-variants`, `GET /product-variants/by-product/{id}` |
| Endereços | CRUD em `/addresses`, `GET /addresses/me`, `PATCH /addresses/{id}/primary` |
| Pedidos | `POST /orders/checkout`, `GET /orders/me`, `GET /orders/me/{id}`, `POST /orders/me/{id}/support-request` |
| CEP | `GET /cep/{zipCode}` (ViaCEP no servidor) |
| Frete | `GET /freights/calculate?zipCode=` |
| Cupons | `GET /coupons/validate?code=&subtotal=`, CRUD administrativo em `/coupons` |
| Transportadoras | CRUD administrativo em `/carriers` |

Rotas públicas incluem listagem de produtos, categorias, variações e imagens. Demais operações exigem token JWT; alterações de catálogo exigem perfil administrador.

---

## Usuários de teste

Senha padrão de todos os usuários seed: **`password`**

| E-mail | Nome completo | Perfil |
|--------|---------------|--------|
| `admin@nexus.com.br` | Administrador do Sistema | ADMIN |
| `enzo@nexus.com.br` | Enzo da Silva Santos | USER |
| `maria@gmail.com` | Maria Costa Ferreira | USER |
| `lucas@gmail.com` | Lucas Costa Ferreira | USER |

O login é feito com **e-mail e senha**.

### Cupons de teste (seed)

| Código | Desconto | Regras |
|--------|----------|--------|
| `NEXUS10` | 10% | Compra mínima R$ 100; **1 uso por usuário** |
| `BEMVINDO20` | 20% | Válido apenas na **primeira compra**; **1 uso por usuário** |

---

## Entidades do domínio

Modelo principal da aplicação (além do sugerido no enunciado, com extensões para e-commerce gamer):

- **User**, **Category**, **Product**, **ProductVariant**
- **Address**, **Order**, **OrderItem**
- **Coupon**, **Carrier**

Produtos possuem variações (plataforma, condição, tipo de entrega, preço e `listPrice` para promoções). Imagens referenciadas por URL servidas pelo back-end (`/images/...`).

---

## Testes automatizados

- **Back-end:** teste de contexto Spring (`ServerApplicationTests`).
- **Front-end:** `npm run build` executa verificação TypeScript (`tsc -b`) antes do bundle Vite.

Testes de integração adicionais (checkout, cupom, frete) podem ser incluídos como evolução futura.

---

## Diferenciais técnicos (back-end)

- Spring Security com JWT e senhas em BCrypt
- DTOs com MapStruct e validação de entrada
- Tratamento global de exceções (`@ControllerAdvice`)
- Soft delete em registros sensíveis (usuários, endereços, cupons)
- Camada genérica reutilizável (`CrudController`, `CrudServiceImpl`)
- Campos agregados de avaliação em produto (`averageRating`, `reviewCount`)
- Integração ViaCEP (`CepLookupService`) e simulação de frete por faixa de CEP
- Validação de cupom no checkout com recálculo server-side e controle de uso por usuário
- Status de pedido (`OrderStatus`) e solicitações de suporte (cancelamento/reembolso/troca)

## Diferenciais técnicos (front-end)

- Componentes reutilizáveis: `ProductCard`, `ProductVariantPicker`, `OrderDetailsView`, `OrderDeliveryTimeline`, `OrderHelpSection`, `AddressFormDialog`
- Utilitários de domínio: `cart-storage`, `checkout-storage`, `order-utils`, `address-utils`, `cep-utils`
- Seletor de variações adaptativo (`COMPACT_VARIANT_THRESHOLD = 3`)
- Checkout em etapas com persistência de frete/cupom entre páginas
- Rotas públicas para vitrine; rotas protegidas para conta e administração
- Build de produção validado (`npm run build`)

### Principais rotas do cliente

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Home | Público |
| `/catalog` | Catálogo com filtros e paginação | Público |
| `/catalog/product/:productId` | Página de detalhes do produto | Público |
| `/cart` | Carrinho de compras | Público |
| `/checkout/identification` | Identificação e endereço | Público* |
| `/checkout/payment` | Revisão e finalização | Autenticado |
| `/checkout/confirmation/:orderId` | Confirmação pós-compra | Autenticado |
| `/login`, `/register` | Autenticação e cadastro | Público |
| `/termos` | Termos de Uso | Público |
| `/privacidade` | Política de Privacidade | Público |
| `/account` | Perfil do usuário | Autenticado |
| `/account/orders` | Histórico de pedidos | Autenticado |
| `/account/orders/:orderId` | Detalhe do pedido | Autenticado |
| `/account/addresses` | Endereços cadastrados | Autenticado |
| `/admin`, `/categories`, `/products` | Gestão administrativa | Admin |

\* A etapa de identificação é acessível sem login, mas exige autenticação para escolher endereço e avançar.

### Roteiro sugerido para demonstração

1. Navegar como **visitante**: home → catálogo → produto → carrinho (CEP + frete + cupom).
2. **Login** com `maria@gmail.com` / `password`.
3. Concluir **checkout** e verificar confirmação.
4. Abrir **Meus pedidos** → detalhe com timeline e card de ajuda.
5. (Opcional) Login **admin** → CRUD de produtos/categorias.

---

## Cronograma de entregas (disciplina)

| Entrega | Prazo | Escopo |
|---------|-------|--------|
| **1ª entrega** | 04/05/2026 | API REST (Spring Boot) — demonstrada via Postman/Insomnia |
| **Entrega final** | 30/06/2026 | Cliente React + servidor integrados — demonstração completa |

Esta branch (`Entrega02`) concentra o **cliente React integrado à API**, pronto para a **entrega final** (demonstração em 30/06/2026).

---

## Licença e uso acadêmico

Projeto desenvolvido exclusivamente para fins acadêmicos na UTFPR — Câmpus Pato Branco.
