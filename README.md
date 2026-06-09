# NEXUS Store — Comércio Eletrônico (PW44S - Turma 4SI)

**Desenvolvedores:** Matheus C. P. Santos e Isacar Freitas  
**Instituição:** UTFPR — Câmpus Pato Branco  
**Branch:** `Entrega02`

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

- Aplicação: `http://localhost:5173`
- A API é acessada em `http://localhost:8080` (configurável por `VITE_API_BASE_URL`)

> Execute **servidor e cliente** ao mesmo tempo para testar a integração completa.

---

## Funcionalidades — Entrega 2

Status alinhado ao enunciado e à avaliação da entrega final (cliente + servidor).

### Requisitos mínimos

| Requisito | Back-end | Front-end |
|-----------|:--------:|:---------:|
| Página com lista de produtos (nome, valor, imagem) | ✅ | ✅ |
| Página individual do produto (detalhes + adicionar ao carrinho) | ✅ | ✅ |
| Carrinho de compras (quantidade, remover item, esvaziar) | ✅ | ✅ |
| Cadastro de usuário (e-mail único) | ✅ | ✅ |
| Autenticação (login) | ✅ | ✅ |
| Resumo da compra e finalização enviada ao servidor | ✅ | ⏳ |
| Catálogo, produto e carrinho acessíveis sem login | ✅ | ✅ |

### Requisitos extras

| Requisito | Back-end | Front-end |
|-----------|:--------:|:---------:|
| Histórico de pedidos do usuário | ✅ | ✅ |
| Filtro de produtos por categoria | ✅ | ✅ |
| Paginação na listagem de produtos | ✅ | ✅ |
| Múltiplos endereços por usuário | ✅ | ⏳ |
| Consulta de CEP (ex.: ViaCEP) | — | ⏳ |
| Cálculo de frete (API externa / simulação) | ✅ | ⏳ |

**Legenda:** ✅ implementado · ⏳ em desenvolvimento / integração pendente

### O que já está disponível no cliente (`Entrega02`)

#### Vitrine e navegação
- **Home** com destaques, categorias e carrossel promocional.
- **Catálogo** paginado com filtros por categoria, plataforma, condição e tipo de entrega.
- **Breadcrumb** contextual nas páginas de catálogo e produto.
- **Tema claro/escuro** com persistência em `localStorage`.
- **Menu da loja** com busca, categorias e acesso rápido ao carrinho.

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

#### Carrinho e fluxos de compra
- **Carrinho** com persistência em `localStorage` para visitantes.
- Componentes reutilizáveis `AddToCartFlow` e `BuyNowFlow` (redireciona para checkout no carrinho).
- Resumo de valores, campos de CEP e cupom (interface preparada).

#### Conta do usuário (`/account`)
- **Layout de conta** com menu lateral (perfil, pedidos, endereços).
- **Perfil:** visualização e edição de dados (`PUT /auth/profile`), avatar customizável.
- **Pedidos:** listagem do histórico via `GET /orders/me`.
- **Endereços:** listagem via `GET /addresses/me`.

#### Autenticação e administração
- Login, registro e sessão JWT com `AuthContext`.
- **Painel administrativo** e CRUD de categorias/produtos (perfil `ADMIN`).

### Melhorias recentes de UI/UX

| Área | O que foi feito |
|------|-----------------|
| **ProductCard** | Redução do espaço excessivo entre título e avaliação; meta agrupada; margem nas estrelas antes do texto "Sem avaliações". |
| **Página de produto** | Migração do layout de 3 colunas para o padrão **2 colunas + abas full width**; container centralizado (`max-width: 1100px`). |
| **Itens semelhantes** | Grid trocado por flex com `justify-content: center` para centralizar os cards. |
| **Variações** | Seletor adaptativo (cards vs. dropdown) para evitar listas verticais muito longas em produtos com muitas opções (ex.: GTA V). |

### O que ainda será integrado nesta entrega

- Fluxo completo de **checkout** (`POST /orders/checkout`) no carrinho.
- **Cadastro e edição** de endereços no cliente (com consulta ViaCEP).
- Integração de **frete por CEP** e **cupons** no carrinho/checkout.

---

## API REST — visão geral

Principais recursos expostos pelo servidor:

| Recurso | Endpoints principais |
|---------|----------------------|
| Autenticação | `POST /login`, `GET /auth/user-info` |
| Usuários | `POST /users` |
| Categorias | CRUD em `/categories` |
| Produtos | CRUD em `/products`, `GET /products/catalog`, `GET /products/by-category/{id}` |
| Variações | CRUD em `/product-variants`, `GET /product-variants/by-product/{id}` |
| Endereços | CRUD em `/addresses`, `GET /addresses/me` |
| Pedidos | `POST /orders/checkout`, `GET /orders/me`, CRUD em `/orders` |
| Frete | `GET /freights/calculate?zipCode=` |
| Cupons / Transportadoras | CRUD administrativo |

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

---

## Entidades do domínio

Modelo principal da aplicação (além do sugerido no enunciado, com extensões para e-commerce gamer):

- **User**, **Category**, **Product**, **ProductVariant**
- **Address**, **Order**, **OrderItem**
- **Coupon**, **Carrier**

Produtos possuem variações (plataforma, condição, tipo de entrega, preço e `listPrice` para promoções). Imagens referenciadas por URL servidas pelo back-end (`/images/...`).

---

## Testes automatizados

A API possui teste de contexto Spring (`ServerApplicationTests`). Casos de teste adicionais de integração e regras de negócio serão ampliados conforme a consolidação da entrega.

---

## Diferenciais técnicos (back-end)

- Spring Security com JWT e senhas em BCrypt
- DTOs com MapStruct e validação de entrada
- Tratamento global de exceções (`@ControllerAdvice`)
- Soft delete em registros sensíveis
- Camada genérica reutilizável (`CrudController`, `CrudServiceImpl`)
- Campos agregados de avaliação em produto (`averageRating`, `reviewCount`)
- Atualização de perfil do usuário autenticado (`PUT /auth/profile`)

## Diferenciais técnicos (front-end)

- Componentes reutilizáveis para e-commerce: `ProductCard`, `ProductRating`, `ProductVariantPicker`, `AddToCartFlow`, `BuyNowFlow`, `ProductReviewsPanel`
- Utilitários de domínio: `product-utils`, `variant-utils`, `cart-storage`, `auth-utils`
- Seletor de variações adaptativo (`COMPACT_VARIANT_THRESHOLD = 3`)
- Rotas públicas para vitrine e rotas protegidas para conta e administração

### Principais rotas do cliente

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Home | Público |
| `/catalog` | Catálogo com filtros e paginação | Público |
| `/catalog/product/:productId` | Página de detalhes do produto | Público |
| `/cart` | Carrinho de compras | Público |
| `/login`, `/register` | Autenticação e cadastro | Público |
| `/account` | Perfil do usuário | Autenticado |
| `/account/orders` | Histórico de pedidos | Autenticado |
| `/account/addresses` | Endereços cadastrados | Autenticado |
| `/admin`, `/categories`, `/products` | Gestão administrativa | Admin |

---

## Cronograma de entregas (disciplina)

| Entrega | Prazo | Escopo |
|---------|-------|--------|
| **1ª entrega** | 04/05/2026 | API REST (Spring Boot) — demonstrada via Postman/Insomnia |
| **Entrega final** | 30/06/2026 | Cliente React + servidor integrados — demonstração completa |

Esta branch (`Entrega02`) concentra o desenvolvimento e a integração do **cliente React** com a API já entregue na primeira fase.

---

## Licença e uso acadêmico

Projeto desenvolvido exclusivamente para fins acadêmicos na UTFPR — Câmpus Pato Branco.
