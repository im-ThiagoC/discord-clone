# Discord Clone Fullstack

<!-- Espaço reservado para imagem da página inicial -->

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone & Install](#clone--install)
  - [Environment Variables](#environment-variables)
  - [Database Setup & Migrations](#database-setup--migrations)
  - [Run the App](#run-the-app)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Profiles**: Sign up / log in (OAuth or custom) and manage your profile.
- **Servers & Channels**
  - Create servers with unique invite codes
  - Create Text, Voice & Video channels
  - Join/leave servers via invite links
- **Real-Time Chat**
  - Broadcast messages in channels via Socket.io
  - One-to-one direct messaging
  - Upload and display file attachments
- **Roles & Permissions**
  - Admin, Moderator, Guest roles
  - Role-based access control per server
- **Persisted Data**
  - All entities (users, servers, channels, messages) stored in PostgreSQL (or MySQL) via Prisma ORM

## Tech Stack

- **Frontend**:
  - Next.js 13 (App Router) & React (TypeScript)
  - Tailwind CSS for utility-first styling
- **Backend**:
  - Next.js API Routes & Socket.io for real-time events
  - Prisma as the ORM layer
  - MySQL database via Prisma (switch from PostgreSQL if preferred)
- **Others**:
  - Vercel (recommended) for zero-config deployment
  - UUIDs for primary keys, automatic timestamps on create/update

## Prerequisites

- **Node.js** v14 or higher
- **pnpm** (recommended), or **npm** / **yarn**
- **MySQL** database with Prisma configuration

## Getting Started

### Clone & Install

```bash
git clone https://github.com/im-ThiagoC/discord-clone.git
cd discord-clone
pnpm install
# or: npm install
```

### Environment Variables

```ini
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXT_PUBLIC_SOCKET_URL="<http://localhost:3000>"
```

### Database Setup & Migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Run the App

```bash
pnpm dev
# or: npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Project Structure

```.
├── app/                   # Next.js App Router pages & layouts
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Helpers (e.g. Socket.io setup)
├── pages/api/socket/      # Socket.io server endpoint
├── prisma/                # Prisma schema & migrations
│   └── schema.prisma
├── public/                # Static assets
├── styles/                # Tailwind configuration
├── .env.local             # Variáveis de ambiente
├── next.config.mjs        # Configuração Next.js
└── tailwind.config.ts     # Configuração Tailwind CSS
```

## Usage

1. **Registrar ou Entrar** com OAuth ou autenticação customizada.
2. **Criar um Servidor** — defina nome e ícone.
3. **Gerar Convite** — compartilhe o código/link.
4. **Entrar em Servidores** via convites.
5. **Criar Canais** e conversar em tempo real.
6. **Mensagens Diretas** — clique no avatar de um usuário para chat privado.

## Contributing

Contribuições são bem-vindas!:

1. Fork o repositório
2. Crie sua branch (`git checkout -b feature/YourFeature`)
3. Commit suas mudanças (`git commit -am 'Add feature'`)
4. Push na branch (`git push origin feature/YourFeature`)
5. Abra um Pull Request

## License

Licenciado sob a MIT License. Veja o [LICENSE](LICENSE) para detalhes.
