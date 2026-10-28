import { formatBytes, formatDuration, formatResolution } from '@/libs/format'
import { cn } from '@/libs/utils'

export type TFileMetaProps = {
  size?: number
  width?: number
  height?: number
  duration?: number
  itemCount?: number
  className?: string
}

export const FileMeta = ({
  size,
  width,
  height,
  duration,
  itemCount,
  className,
}: TFileMetaProps) => {
  const parts: Array<string> = []

  if (typeof itemCount === 'number') {
    parts.push(`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`)
  }

  if (typeof size === 'number') {
    parts.push(formatBytes(size))
  }

  if (typeof duration === 'number') {
    parts.push(formatDuration(duration))
  }

  const res = formatResolution(width, height)
  if (res) {
    parts.push(res)
  }

  return (
    <p className={cn('text-body-sm text-muted-foreground truncate', className)}>
      {parts.join(' · ')}
    </p>
  )
}
