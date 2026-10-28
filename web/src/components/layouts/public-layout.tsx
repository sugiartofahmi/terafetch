import type { ReactNode } from 'react'

export const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center p-4">
    {children}
  </div>
)
