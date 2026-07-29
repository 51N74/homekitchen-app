// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './index.css'

import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

// ลงทะเบียน Router กับ TypeScript เพื่อให้เช็ก Path แม่นยำ (Type-safe)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)