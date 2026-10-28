import type { ReactNode } from 'react'
import { cn } from '@/libs/utils'

export type TMetaPillProps = {
  children: ReactNode
  className?: string
}

export const MetaPill = ({ children, className }: TMetaPillProps) => {
  return (
    <li
      className={cn(
        'list-none rounded-full border border-border bg-secondary px-3 py-0.5 text-body-sm text-foreground select-none',
        className,
      )}
    >
      {children}
    </li>
  )
}
