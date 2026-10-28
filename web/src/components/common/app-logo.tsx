import { Link } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { cn } from '@/libs/utils'

export type TAppLogoProps = {
  className?: string
  showLink?: boolean
}

export const AppLogo = ({ className, showLink = true }: TAppLogoProps) => {
  const content = (
    <div
      className={cn(
        'inline-flex items-center gap-2 font-display text-lg font-bold text-foreground',
        className,
      )}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Download className="size-4 stroke-[2.5]" />
      </span>
      <span>
        Tera<span className="text-primary">Fetch</span>
      </span>
    </div>
  )

  if (!showLink) {
    return content
  }

  return (
    <Link to="/" className="inline-flex transition-opacity hover:opacity-90">
      {content}
    </Link>
  )
}
