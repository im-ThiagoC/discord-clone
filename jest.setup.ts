import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => require('next-router-mock/navigation'))

// Mock do Clerk (evita puxar @clerk/backend/* ESM)
jest.mock('@clerk/nextjs', () => {
  const React = require('react')
  const Fragment = React.Fragment

  return {
    __esModule: true,
    // Provider “no-op” que apenas renderiza children
    ClerkProvider: ({ children }: any) => React.createElement(Fragment, null, children),

    // APIs usadas no seu código; ajuste conforme necessário
    auth: jest.fn(() => ({ userId: 'test-user' })),
    currentUser: jest.fn(async () => ({ id: 'test-user' })),
    useAuth: () => ({ userId: 'test-user' }),
    useUser: () => ({ user: { id: 'test-user' } }),

    // Componentes condicionais
    SignedIn: ({ children }: any) => React.createElement(Fragment, null, children),
    SignedOut: ({ children }: any) => null,
  }
})

jest.mock('@/components/providers/modal-provider', () => ({
  __esModule: true,
  // seu código usa <ModalProvider /> sozinho (não como wrapper),
  // então podemos retornar null
  ModalProvider: () => null,
}))

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),        // suporte legacy
      removeListener: jest.fn(),
      addEventListener: jest.fn(),   // suporte moderno
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}