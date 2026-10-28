import { AppHeader } from './app-header'
import type { ReactNode } from 'react'

export type TAppLayoutProps = {
  children: ReactNode
}

export const AppLayout = ({ children }: TAppLayoutProps) => {
  return (
    <div className="flex min-h-svh flex-col bg-glow px-4 pb-12">
      <AppHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
