import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/libs/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 text-caption transition-colors select-none font-medium',
  {
    variants: {
      variant: {
        default:
          'rounded-full border border-border bg-secondary text-foreground',
        outline: 'rounded-full border border-border text-muted-foreground',
        primary:
          'rounded-full border border-primary/40 bg-transparent text-primary',
        overlay: 'rounded-full bg-background/85 text-foreground font-semibold',
        square: 'rounded-md bg-background/85 text-foreground',
      },
      size: {
        default: 'px-3 py-1 text-body-sm',
        sm: 'px-2.5 py-1 text-caption',
        xs: 'px-2 py-0.5 text-caption',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type TBadgeProps = React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants>

function Badge({ className, variant, size, ...props }: TBadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
