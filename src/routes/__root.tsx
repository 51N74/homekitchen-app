import { QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router' // ตรวจสอบชื่อแพ็กเกจหลักให้ถูก
import { TanStackRouterDevtools } from '@tanstack/router-devtools' // แยกแพ็กเกจออกมาแล้ว
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '../lib/queryClient'
import { Toaster } from '@/components/ui/sonner'

// เอาหน้าตา UI ยัดเข้าไปข้างใน component: () => (...) เลย เพื่อแก้ปัญหา Fast Refresh
export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <Link to="/" className="text-xl font-bold text-orange-500">
              🏠 HomeKitchen
            </Link>
            <nav className="flex gap-4 font-medium text-zinc-600">
              <Link to="/" className="[&.active]:text-orange-500 hover:text-zinc-900">หน้าแรก</Link>
              <Link to="/cart" className="[&.active]:text-orange-500 hover:text-zinc-900">ตะกร้า</Link>
              <Link to="/orders" className="[&.active]:text-orange-500 hover:text-zinc-900">ออเดอร์</Link>
            </nav>
          </div>
        </header>

        {/* ส่วนแสดงผลหน้าย่อย */}
        <main className="mx-auto max-w-7xl p-4">
          <Outlet />
        </main>

        <Toaster />
        
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </QueryClientProvider>
  )
})