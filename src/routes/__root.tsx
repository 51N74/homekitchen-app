import { QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router' 
import { TanStackRouterDevtools } from '@tanstack/router-devtools' 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '../lib/queryClient'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/common/Header' 
import { CartProvider } from '@/context/CartContext'
import { FavoritesProvider } from '@/context/FavoritesContext' 

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <FavoritesProvider>
          <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
            {/* เรียกใช้ Header ส่วนกลางที่แยกออกมาเรียบร้อย */}
            <Header />

            {/* ส่วนแสดงผลหน้าย่อย */}
            <main className="grow">
              <Outlet />
            </main>

            <Toaster />
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <TanStackRouterDevtools position="bottom-right" />
          </div>
        </FavoritesProvider>
      </CartProvider>
    </QueryClientProvider>
  )
})