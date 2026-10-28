import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export type TBackLinkProps = {
  url: string
}

export const BackLink = ({ url }: TBackLinkProps) => {
  return (
    <Link
      to="/result"
      search={{ url }}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-body-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
    >
      <ArrowLeft className="size-4" />
      <span>Back to Files</span>
    </Link>
  )
}
