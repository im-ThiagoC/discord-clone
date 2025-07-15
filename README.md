# Discord Clone Fullstack

A full-featured Discord clone built as a hands-on course project using Next.js, React, Socket.io, Prisma, Tailwind CSS and PostgreSQL.

[Live Demo](https://discord-clone-seven-tan.vercel.app)

---

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

---

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

---

## Tech Stack

- **Frontend**:  
  - Next.js 13 (App Router) & React (TypeScript)  
  - Tailwind CSS for utility-first styling  
- **Backend**:  
  - Next.js API Routes & Socket.io for real-time events  
  - Prisma as the ORM layer  
  - PostgreSQL (default) — easily switch to MySQL by updating `provider` in `schema.prisma`  
- **Others**:  
  - Vercel (recommended) for zero-config deployment  
  - UUIDs for primary keys, automatic timestamps on create/update  

---

## Prerequisites

- **Node.js** v14 or higher  
- **pnpm** (recommended), or **npm** / **yarn**  
- **PostgreSQL** database (or MySQL with Prisma configuration adjusted)  

---

## Getting Started

### Clone & Install

```bash
git clone https://github.com/im-ThiagoC/discord-clone.git
cd discord-clone
pnpm install
# or: npm install
