// tests/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import React from 'react'

// Estes virão do mock do jest.setup.ts
import { ClerkProvider } from '@clerk/nextjs'

// Seus providers
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={false}
        storageKey="discord-theme"
      >
          <ModalProvider />
          <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}
