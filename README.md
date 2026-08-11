# Moneyly - Sistema de Gestão Financeira

<div align="center">
  <img src="public/logo-moneyly.png" alt="Moneyly Logo" width="120" height="120" />
  <h1>Moneyly</h1>
  <p><strong>Gerencie suas finanças de forma inteligente</strong></p>
</div>

## Sobre o Projeto

O **Moneyly** é uma aplicação web moderna para gestão financeira pessoal, desenvolvida com Next.js 15 e TypeScript. A aplicação permite aos usuários controlar suas receitas, despesas, categorias e acompanhar seu orçamento mensal de forma intuitiva e eficiente.

### ✨ Principais Funcionalidades

- **Autenticação Segura**: Login/registro com email/senha e integração com Google OAuth
- 💰 **Gestão de Transações**: Adicionar, editar e visualizar receitas e despesas
- 📊 **Dashboard Inteligente**: Visão geral das finanças com estatísticas em tempo real
- 🏷️ **Categorização**: Organize transações por categorias personalizáveis
- 📅 **Período Financeiro Flexível**: Configure seu próprio período financeiro mensal
- 🌙 **Tema Escuro/Claro**: Interface adaptável com suporte a temas
- 📱 **Responsivo**: Design otimizado para desktop e dispositivos móveis
- ⚡ **Performance**: Aplicação rápida com React Query e otimizações

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React 19** - Biblioteca de interface
- **Tailwind CSS 4** - Framework de estilização
- **Framer Motion** - Animações fluidas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### UI/UX

- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações elegantes
- **React Day Picker** - Seleção de datas
- **Next Themes** - Gerenciamento de temas

### Estado e Dados

- **TanStack Query** - Gerenciamento de estado do servidor
- **Axios** - Cliente HTTP
- **React Context** - Gerenciamento de estado global

### Autenticação

- **Google OAuth** - Login social
- **JWT Tokens** - Autenticação segura
- **Cookies** - Persistência de sessão

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm
- Conta Google para OAuth (opcional)

### Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd moneyly-front
```

2. **Instale as dependências**

```bash
pnpm install
# ou
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Google OAuth (opcional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_google_client_id

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Push notifications (opcional — sem elas o app roda, só não oferece push).
# Console do Firebase → Configurações do projeto → Seus apps → App da Web.
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
# Cloud Messaging → Configuração da Web → Certificados push da Web (chave pública)
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

4. **Execute o projeto**

```bash
pnpm dev
# ou
npm run dev
```

5. **Acesse a aplicação**

```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (components)/          # Componentes reutilizáveis
│   │   ├── (bases)/          # Componentes base (inputs, forms, etc.)
│   │   ├── (dialogs)/        # Modais e diálogos
│   │   ├── (elements)/       # Elementos básicos (logo, etc.)
│   │   ├── (layout)/         # Componentes de layout
│   │   └── (motions)/        # Animações
│   ├── (contexts)/           # Contextos React (Auth, Theme)
│   ├── (helpers)/            # Funções utilitárias
│   ├── (layouts)/            # Layouts da aplicação
│   ├── (resources)/          # Recursos específicos
│   │   ├── (forms)/          # Formulários
│   │   ├── (schemas)/        # Schemas de validação
│   │   └── (tables)/         # Tabelas de dados
│   ├── (routes)/             # Páginas da aplicação
│   │   ├── (private)/        # Rotas autenticadas
│   │   └── (public)/         # Rotas públicas
│   ├── (services)/           # Serviços de API
│   ├── (types)/              # Definições de tipos TypeScript
│   └── (utils)/              # Utilitários
├── components/
│   └── ui/                   # Componentes UI base
├── hooks/                    # Custom hooks
└── lib/                      # Bibliotecas e configurações
```

<div align="center">
  <p>Desenvolvido com ❤️ para ajudar você a controlar suas finanças</p>
  <p><strong>Moneyly</strong> - Sua vida financeira organizada</p>
</div>
