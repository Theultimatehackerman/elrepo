# Content OS

Plataforma de organização e gestão de conteúdo para Social Medias, freelancers e pequenas agências.

> Seu conteúdo. Organizado do início ao fim.


Esta é a primeira versão do produto: uma aplicação **frontend completa**, com dados mockados e persistência em `localStorage`. Não há backend, banco de dados ou autenticação real — o foco é a experiência do produto e a qualidade da interface.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- [Zustand](https://zustand-demo.pmnd.rs/) (`persist` middleware) para estado e persistência
- [Framer Motion](https://www.framer.com/motion/) para animações
- [Radix UI](https://www.radix-ui.com/) como base dos componentes do Design System
- [dnd-kit](https://dndkit.com/) para drag & drop (Calendar e Kanban)

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A landing page fica em `/`; a aplicação em si começa em `/dashboard`.

```bash
npm run build   # build de produção
npm run start   # roda o build de produção
npm run lint    # eslint
```

## Funcionalidades

- **Autenticação & Cadastro** — tela de cadastro (`/register`) para criação de novos workspaces/usuários e tela de login (`/login`) com atalho para modo de demonstração. Persistência de sessão no `localStorage`, proteção de rotas com `AuthGuard` e botão de logout ("Sair da conta") na barra superior e no menu móvel.
- **Dashboard** — resumo do que está acontecendo: conteúdos em produção, aguardando aprovação, agendados e publicados; conteúdos recentes; aprovações pendentes; próximos conteúdos (Hoje/Amanhã); feed de atividades.
- **Content** — listagem em grid, lista ou Kanban, com busca e filtros combináveis (cliente, plataforma, status, campanha, responsável). Criação, edição, exclusão e página de detalhe (roteiro, legenda, hashtags, CTA, mídia, comentários e histórico). A mídia pode ser escolhida diretamente do Google Drive (opcional — veja abaixo).
- **Calendar** — visualização por mês, semana ou dia, com drag & drop para reagendar conteúdos. Na visualização de mês, é possível exportar o calendário (respeitando os filtros ativos) como imagem PNG ou PDF, pronto para compartilhar com clientes.
- **Kanban** — board com as 7 etapas do fluxo editorial (Ideia → Roteiro → Produção → Edição → Aprovação → Agendado → Publicado), com drag & drop entre colunas.
- **Approvals** — fila de conteúdos aguardando aprovação e página de revisão (`/review/[id]`) para aprovar ou solicitar alteração.
- **Clients** e **Campaigns** — cadastro e gestão, com os conteúdos relacionados a cada um.
- **Settings** — workspace, perfil e preferências (formato de data, início da semana).
- **Landing page** — apresentação do produto (Hero, Problema, Solução, Workflow, Calendário, Colaboração, Aprovação, Analytics conceitual, CTA).

## Arquitetura

```
src/
├── app/                    # rotas (App Router)
│   ├── (app)/              # aplicação protegida por AuthGuard: sidebar + topbar
│   │   ├── dashboard/
│   │   ├── calendar/
│   │   ├── content/[id]?/
│   │   ├── campaigns/[id]?/
│   │   ├── clients/[id]?/
│   │   ├── approvals/
│   │   └── settings/
│   ├── register/           # página de cadastro de novos usuários/workspaces
│   ├── login/              # página de login com credenciais locais ou modo demonstração
│   ├── review/[id]/        # página de aprovação, sem sidebar
│   ├── api/parse-task/      # rota server-side que chama a IA (única exceção "backend")
│   └── page.tsx            # landing page
│
├── components/
│   ├── ui/                 # Design System (Button, Badge, Modal, Toast, ...)
│   ├── layout/              # Sidebar, Topbar, MobileNav, PageHeader, AuthGuard
│   ├── content/, calendar/, kanban/, dashboard/, clients/, campaigns/, comments/, marketing/
│
├── data/                    # mock data (usuários, clientes, campanhas, conteúdos...)
├── store/                   # stores Zustand (auth, content, client, campaign, comment, activity, settings)
├── lib/
│   ├── storage/             # adapter único de localStorage usado pelos stores
│   ├── constants/            # status e plataformas (labels, ícones, cores)
│   ├── google-drive/          # config, loader de scripts e tipos do Drive Picker
│   └── utils/                 # cn, datas, ids, texto, gradientes
├── hooks/                    # useLocalStorage, useGoogleDrivePicker, useSpeechRecognition
└── types/                     # tipos e enums do domínio
```

### Persistência

Cada entidade (autenticação/sessão, conteúdos, clientes, campanhas, comentários, atividades, configurações) tem seu próprio store Zustand com `persist`, gravando em uma chave própria do `localStorage` (`content-os-*`). Todo o acesso ao `localStorage` passa por um único adapter em `src/lib/storage/local-storage.ts` — se no futuro isso virar uma API real, só esse arquivo precisa mudar.

Os dados iniciais vêm de `src/data/mock-*.ts`. Na primeira visita, os stores usam esses mocks; a partir da primeira alteração, tudo passa a ser lido/gravado do `localStorage`, sobrevivendo a refresh da página.

## Integração com Google Drive (opcional)

Ao criar/editar um conteúdo (ou na página de detalhe), é possível anexar como mídia um arquivo escolhido diretamente do seu Google Drive, em vez do thumbnail gerado. A integração roda inteiramente no navegador — não usa nem precisa de backend.

**1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/):**

1. Crie um projeto (ou use um existente) e ative a **Google Picker API** e a **Google Drive API** em "APIs e serviços".
2. Em "Tela de consentimento OAuth", configure como app **externo** em modo de teste (não precisa de verificação, já que usamos o escopo `drive.file` — a aplicação só acessa os arquivos que você escolher explicitamente no seletor).
3. Em "Credenciais", crie:
   - uma **Chave de API** (API key) — pode restringir por domínio (`localhost` para desenvolvimento);
   - um **ID do cliente OAuth 2.0** do tipo "Aplicativo da Web", com `http://localhost:3000` em "Origens JavaScript autorizadas".

**2. Configure as variáveis de ambiente:**

```bash
cp .env.local.example .env.local
```

Preencha `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_API_KEY=sua-api-key
```

`.env.local` nunca é commitado (já está no `.gitignore`).

**3. Reinicie o `npm run dev`.** O botão "Escolher do Google Drive" aparece no formulário de conteúdo e na página de detalhe. Sem essas variáveis configuradas, o botão avisa que a integração não está configurada, mas o resto do app funciona normalmente.

**Limitação conhecida:** o token de acesso obtido no navegador expira em ~1h e, sem backend, não há refresh token seguro — pode ser necessário reconectar a conta Google de tempos em tempos.

## Criar conteúdo por voz (opcional)

O botão **"Criar por voz"** na barra superior grava sua fala (Web Speech API do navegador — funciona no Chrome/Edge; outros navegadores caem no modo de digitar o texto manualmente), envia a transcrição para uma IA (GROQ) extrair título, cliente, plataforma, formato e data, e pré-preenche o formulário de criação de conteúdo para você revisar antes de salvar.

**1. Gere uma API key do GROQ** em [console.groq.com](https://console.groq.com/keys).

**2. Configure `.env.local`:**

```bash
GROQ_API_KEY=gsk_...
```

Sem o prefixo `NEXT_PUBLIC_` — essa chave é usada **apenas no servidor**, dentro da rota `src/app/api/parse-task/route.ts`, e nunca chega ao navegador.

**3. Reinicie o `npm run dev`.** Sem essa variável configurada, o botão "Criar por voz" avisa que a integração não está configurada; o restante do app continua funcionando normalmente.

A extração usa JSON Schema via GROQ (`openai/gpt-oss-120b`) com validação Zod no servidor, então o retorno já vem no formato certo — sem parsing manual de texto livre.

Feito por [Lázaro Vasconcelos](mailto:lazaro.vasconcelos@sollydus.com.br).