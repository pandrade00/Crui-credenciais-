# CRUI - Gerenciador de Credenciais

Frontend em React para consulta, cadastro, edição e controle de status de credenciais de serviços e fornecedores de turismo.

## Funcionalidades

- Listagem paginada e busca global de credenciais em tempo real por nome, fornecedor ou tipo de serviço.
- Cadastro e edição de credenciais com parâmetros dinâmicos por fornecedor.
- Ativação e desativação de credenciais com atualização direta na API.
- Validação de formulários e campos obrigatórios com Yup.
- Notificações de feedback (toasts) e mensagens de erro inline.

## Tecnologias

- React 19 + TypeScript
- Vite
- Stitches (CSS-in-JS)
- Radix UI
- Yup
- Vitest + Testing Library
- Storybook
- Oxlint

## Pré-requisitos

- Node.js (v18 ou superior)
- npm, yarn ou pnpm

## Configuração do Ambiente

1. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

2. Configure as variáveis com o endpoint e credenciais da API:

```env
VITE_API_URL=https://teste.biztrip.com.br/api/v1
VITE_USER_EMAIL=seu_email@dominio.com
VITE_USER_PASSWORD=sua_senha
```

## Como Rodar o Projeto

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

## Testes Unitários

Para executar a suíte completa de testes unitários:

```bash
npm run test
```

Para rodar os testes em modo contínuo (watch):

```bash
npm run test:watch
```

## Storybook

Para visualizar a documentação e os componentes da interface em ambiente isolado:

```bash
npm run storybook
```

O Storybook abrirá na porta `6006` (`http://localhost:6006`).

## Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Vite |
| `npm run build` | Valida tipagens TypeScript e gera o build de produção |
| `npm run preview` | Executa localmente o build de produção |
| `npm run test` | Roda os testes unitários com Vitest |
| `npm run test:watch` | Roda os testes unitários em modo observador |
| `npm run lint` | Executa a verificação de código com Oxlint |
| `npm run storybook` | Inicia o Storybook na porta 6006 |
| `npm run build-storybook` | Gera a versão estática do Storybook |

## Estrutura de Pastas

```text
src/
├── components/
│   ├── form/       # Modais de cadastro e edição de credenciais
│   ├── layout/     # Cabeçalho, rodapé, cards e toasts
│   └── pages/      # Páginas principais da aplicação
├── context/        # Contextos globais (Autenticação e Toasts)
├── interfaces/     # Definições de tipos e interfaces TypeScript
├── schemas/        # Schemas de validação de formulários com Yup
├── service/        # Funções de integração com a API REST
├── test/           # Testes unitários com Vitest e Testing Library
├── App.tsx         # Configuração de rotas e providers
├── index.css       # Estilos globais
└── main.tsx        # Ponto de entrada do React
```
