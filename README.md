This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

├── .eslintrc.json
├── .gitignore
├── .vscode
    └── settings.json
├── README.md
├── app
    ├── (auth)
    │   ├── (routes)
    │   │   ├── sign-in
    │   │   │   └── [[...sign-in]]
    │   │   │   │   └── page.tsx
    │   │   └── sign-up
    │   │   │   └── [[...sign-up]]
    │   │   │       └── page.tsx
    │   └── layout.tsx
    ├── (invite)
    │   └── (routes)
    │   │   └── invite
    │   │       └── [inviteCode]
    │   │           └── page.tsx
    ├── (main)
    │   ├── (routes)
    │   │   └── servers
    │   │   │   └── [serverId]
    │   │   │       ├── channels
    │   │   │           └── [channelId]
    │   │   │           │   └── page.tsx
    │   │   │       ├── conversations
    │   │   │           └── [memberId]
    │   │   │           │   └── page.tsx
    │   │   │       ├── layout.tsx
    │   │   │       └── page.tsx
    │   └── layout.tsx
    ├── (setup)
    │   └── page.tsx
    ├── api
    │   ├── channels
    │   │   ├── [channelId]
    │   │   │   └── route.ts
    │   │   └── route.ts
    │   ├── direct-messages
    │   │   └── route.ts
    │   ├── livekit
    │   │   └── route.ts
    │   ├── members
    │   │   └── [memberId]
    │   │   │   └── route.ts
    │   ├── messages
    │   │   └── route.ts
    │   ├── servers
    │   │   ├── [serverId]
    │   │   │   ├── invite-code
    │   │   │   │   └── route.ts
    │   │   │   ├── leave
    │   │   │   │   └── route.ts
    │   │   │   └── route.ts
    │   │   └── route.ts
    │   └── uploadthing
    │   │   ├── core.ts
    │   │   └── route.ts
    ├── favicon.ico
    ├── globals.css
    ├── image
    │   └── page.tsx
    └── layout.tsx
├── components.json
├── components
    ├── action-tooltip.tsx
    ├── chat
    │   ├── chat-header.tsx
    │   ├── chat-input.tsx
    │   ├── chat-item.tsx
    │   ├── chat-messages.tsx
    │   └── chat-welcome.tsx
    ├── emoji-picker.tsx
    ├── file-upload.tsx
    ├── media-room.tsx
    ├── mobile-toggle.tsx
    ├── modals
    │   ├── create-channel-modal.tsx
    │   ├── create-server-modal.tsx
    │   ├── delete-channel-modal.tsx
    │   ├── delete-message-modal.tsx
    │   ├── delete-server-modal.tsx
    │   ├── edit-channel-modal.tsx
    │   ├── edit-server-modal.tsx
    │   ├── initial-modal.tsx
    │   ├── invite-modal.tsx
    │   ├── leave-server-modal.tsx
    │   ├── members-modal.tsx
    │   └── message-file-modal.tsx
    ├── mode-toggle.tsx
    ├── navigations
    │   ├── navigation-action.tsx
    │   ├── navigation-item.tsx
    │   └── navigation-sidebar.tsx
    ├── providers
    │   ├── modal-provider.tsx
    │   ├── query-provider.tsx
    │   ├── socket-provider.tsx
    │   └── theme-provider.tsx
    ├── server
    │   ├── server-channel.tsx
    │   ├── server-header.tsx
    │   ├── server-member.tsx
    │   ├── server-search.tsx
    │   ├── server-section.tsx
    │   └── server-sidebar.tsx
    ├── socket-indicator.tsx
    ├── ui
    │   ├── avatar.tsx
    │   ├── badge.tsx
    │   ├── button.tsx
    │   ├── command.tsx
    │   ├── dialog.tsx
    │   ├── dropdown-menu.tsx
    │   ├── form.tsx
    │   ├── input.tsx
    │   ├── label.tsx
    │   ├── popover.tsx
    │   ├── scroll-area.tsx
    │   ├── select.tsx
    │   ├── separator.tsx
    │   ├── sheet.tsx
    │   └── tooltip.tsx
    └── user-avatar.tsx
├── hooks
    ├── use-chat-query.ts
    ├── use-chat-scroll.ts
    ├── use-chat-socket.ts
    ├── use-modal-store.ts
    └── use-origin.ts
├── lib
    ├── conversation.ts
    ├── current-profile-pages.ts
    ├── current-profile.ts
    ├── db.ts
    ├── initial-profile.ts
    ├── uploadthing.ts
    └── utils.ts
├── middleware.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pages
    └── api
    │   └── socket
    │       ├── direct-messages
    │           ├── [directMessageId].ts
    │           └── index.ts
    │       ├── io.ts
    │       └── messages
    │           ├── [messageId].ts
    │           └── index.ts
├── postcss.config.js
├── prisma
    └── schema.prisma
├── public
    ├── next.svg
    └── vercel.svg
├── tailwind.config.ts
├── tsconfig.json
└── types.ts

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
