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
| Histórico de pedidos do usuário | ✅ | ⏳ |
| Filtro de produtos por categoria | ✅ | ✅ |
| Paginação na listagem de produtos | ✅ | ✅ |
| Múltiplos endereços por usuário | ✅ | ⏳ |
| Consulta de CEP (ex.: ViaCEP) | — | ⏳ |
| Cálculo de frete (API externa / simulação) | ✅ | ⏳ |

**Legenda:** ✅ implementado · ⏳ em desenvolvimento / integração pendente

### O que já está disponível no cliente (`Entrega02`)

- **Vitrine pública:** home, catálogo paginado, filtros por categoria, plataforma, condição e entrega.
- **Página de produto:** detalhes, variações, preços promocionais e fluxo de adicionar ao carrinho.
- **Carrinho:** persistência em `localStorage` para usuários não autenticados.
- **Autenticação:** login, registro e sessão JWT.
- **Painel administrativo:** gestão de categorias e produtos (perfil `ADMIN`).

### O que ainda será integrado nesta entrega

- Fluxo completo de **checkout** (`POST /orders/checkout`).
- Telas de **endereços** do cliente (`/addresses/me`).
- **Histórico de pedidos** (`GET /orders/me`).
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
