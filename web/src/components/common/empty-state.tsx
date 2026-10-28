import { FolderOpen } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/libs/utils'

export type TEmptyStateProps = {
  title?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export const EmptyState = ({
  title = 'No files found',
  description = 'This folder does not contain any files matching your selection.',
  icon,
  action,
  className,
}: TEmptyStateProps) => {
  return (
    <Card
      className={cn(
        'mx-auto flex w-full max-w-xl flex-col items-center p-8 text-center sm:p-10',
        className,
      )}
    >
      <div className="grid size-14 place-items-center rounded-2xl border border-border bg-secondary text-muted-foreground">
        {icon ?? <FolderOpen className="size-7" />}
      </div>
      <h3 className="mt-4 text-title">{title}</h3>
      <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </Card>
  )
}
