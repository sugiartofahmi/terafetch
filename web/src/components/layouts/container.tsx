import type { ReactNode } from 'react'
import { cn } from '@/libs/utils'

export type TContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'main' | 'section' | 'header'
}

export const Container = ({
  children,
  className,
  as: Component = 'div',
}: TContainerProps) => {
  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </Component>
  )
}
