import type { ReactNode } from 'react'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Navbar } from '@/components/ui/navbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export const ProtectedLayout = ({ children }: { children: ReactNode }) => (
  <TooltipProvider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
)
