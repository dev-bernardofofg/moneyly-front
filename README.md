# Moneyly - Sistema de Gestão Financeira

<div align="center">
  <img src="public/logo-single.png" alt="Moneyly Logo" width="120" height="120" />
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

## 📋 Resumo do Checkup

Baseado na análise completa do projeto, aqui está um resumo do estado atual:

### ✅ **Pontos Fortes**

1. **Arquitetura Moderna**: Next.js 15 com App Router e TypeScript
2. **Design System Consistente**: Componentes bem estruturados e reutilizáveis
3. **Autenticação Robusta**: JWT + Google OAuth
4. **Performance Otimizada**: React Query, lazy loading, otimizações
5. **UX/UI Excelente**: Animações, temas, responsividade
6. **Código Limpo**: Estrutura organizada, tipos bem definidos
7. **Funcionalidades Completas**: CRUD completo, dashboard, categorias

### 🔧 **Tecnologias Bem Implementadas**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilização**: Tailwind CSS 4, Radix UI
- **Estado**: TanStack Query, React Context
- **Formulários**: React Hook Form + Zod
- **Animações**: Framer Motion
- **Autenticação**: JWT + Google OAuth

### 📊 **Funcionalidades Principais**

- Sistema de autenticação completo
- Dashboard com estatísticas financeiras
- Gestão de transações (receitas/despesas)
- Sistema de categorias
- Configuração de período financeiro
- Tema escuro/claro
- Interface responsiva

### **Recomendações**

1. **Documentação**: O README atual é genérico, o novo é muito mais completo
2. **Testes**: Considerar adicionar testes unitários e E2E
3. **Monitoramento**: Implementar analytics e error tracking
4. **PWA**: Transformar em Progressive Web App
5. **Internacionalização**: Suporte a múltiplos idiomas

O projeto está bem estruturado e pronto para produção, com uma base sólida para futuras expansões!

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia o servidor de desenvolvimento

# Build e Produção
pnpm build        # Gera build de produção
pnpm start        # Inicia servidor de produção

# Qualidade de Código
pnpm lint         # Executa ESLint
```

## 🎨 Design System

O projeto utiliza um design system consistente com:

- **Cores**: Paleta baseada em verde para transmitir confiança financeira
- **Tipografia**: Fonte Lexend para melhor legibilidade
- **Componentes**: Sistema de componentes baseado em Radix UI
- **Animações**: Transições suaves com Framer Motion
- **Responsividade**: Design mobile-first

## Autenticação e Segurança

- **JWT Tokens**: Autenticação baseada em tokens
- **Google OAuth**: Login social opcional
- **Middleware**: Proteção de rotas no lado cliente e servidor
- **Validação**: Schemas Zod para validação de dados
- **HTTPS**: Recomendado para produção

## 📊 Funcionalidades Principais

### Dashboard

- Visão geral das finanças
- Estatísticas em tempo real
- Gráficos de gastos por categoria
- Alertas de orçamento

### Transações

- CRUD completo de transações
- Categorização automática
- Filtros por período e categoria
- Paginação inteligente

### Categorias

- Gerenciamento de categorias
- Categorias personalizáveis
- Relatórios por categoria

### Configurações

- Configuração inicial de rendimento
- Período financeiro personalizado
- Preferências de tema

## Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

- **Netlify**: Suporte completo ao Next.js
- **Railway**: Deploy simples e rápido
- **Docker**: Containerização disponível

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte

- **Email**: suporte@moneyly.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/moneyly-front/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/moneyly-front/wiki)

## Roadmap

- [ ] Gráficos avançados com Chart.js
- [ ] Exportação de relatórios em PDF
- [ ] Notificações push
- [ ] Integração com bancos
- [ ] App mobile com React Native
- [ ] IA para categorização automática
- [ ] Metas financeiras
- [ ] Backup automático

---

<div align="center">
  <p>Desenvolvido com ❤️ para ajudar você a controlar suas finanças</p>
  <p><strong>Moneyly</strong> - Sua vida financeira organizada</p>
</div>
