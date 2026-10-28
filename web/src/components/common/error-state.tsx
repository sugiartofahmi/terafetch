import { Link } from '@tanstack/react-router'
import { AlertTriangle, Home, RefreshCw, WifiOff } from 'lucide-react'
import type { TAppError } from '@/integrations/axios/error'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/libs/utils'

export type TErrorStateProps = {
  error?: TAppError | Error | null
  title?: string
  message?: string
  retryable?: boolean
  onRetry?: () => void
  className?: string
  compact?: boolean
}

export const ErrorState = ({
  error,
  title,
  message,
  retryable,
  onRetry,
  className,
  compact = false,
}: TErrorStateProps) => {
  const isAppError = error && 'title' in error && 'message' in error
  const displayTitle =
    title || (isAppError ? error.title : 'Something went wrong')
  const displayMessage =
    message ||
    (isAppError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.')
  const isRetryable =
    retryable ?? (isAppError ? error.retryable : Boolean(onRetry))

  const isOffline =
    displayTitle.toLowerCase().includes('offline') ||
    displayTitle.toLowerCase().includes('network')

  if (compact) {
    return (
      <div
        role="alert"
        className={cn(
          'flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-left',
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 shrink-0 text-destructive" />
          <div>
            <p className="text-body-sm font-semibold text-foreground">
              {displayTitle}
            </p>
            <p className="text-caption text-muted-foreground">
              {displayMessage}
            </p>
          </div>
        </div>
        {onRetry && isRetryable && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="shrink-0 gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            <span>Try again</span>
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card
      role="alert"
      className={cn(
        'mx-auto flex w-full max-w-xl flex-col items-center p-8 text-center sm:p-10',
        className,
      )}
    >
      <div className="grid size-14 place-items-center rounded-2xl border border-border bg-secondary text-primary">
        {isOffline ? (
          <WifiOff className="size-7" />
        ) : (
          <AlertTriangle className="size-7" />
        )}
      </div>

      <h2 className="mt-5 text-h2">{displayTitle}</h2>
      <p className="mt-2 max-w-md text-body-sm text-muted-foreground">
        {displayMessage}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && isRetryable && (
          <Button type="button" onClick={onRetry} className="gap-2">
            <RefreshCw className="size-4" />
            <span>Try again</span>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link to="/" className="gap-2">
            <Home className="size-4" />
            <span>Back to home</span>
          </Link>
        </Button>
      </div>
    </Card>
  )
}
