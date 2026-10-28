import * as React from 'react'
import { cva } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/libs/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground font-semibold hover:bg-primary/90',
        outline:
          'border border-border bg-transparent text-foreground font-semibold hover:border-primary hover:text-primary',
        secondary:
          'border border-border bg-secondary text-foreground font-medium hover:bg-secondary/80',
        ghost:
          'text-muted-foreground hover:bg-secondary hover:text-foreground font-medium',
        destructive:
          'bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline font-medium',
      },
      size: {
        sm: 'min-h-8 px-3 text-xs rounded-lg',
        default: 'min-h-10 px-4 text-sm font-semibold rounded-lg',
        lg: 'min-h-11 px-5 text-sm font-semibold rounded-lg',
        xl: 'h-12 px-6 text-base font-semibold rounded-xl',
        pill: 'min-h-9 px-4 text-sm font-semibold rounded-full',
        icon: 'size-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
