import { Badge } from '@/components/ui/badge'

export const Hero = () => {
  return (
    <div className="text-center pt-8 sm:pt-12">
      <Badge variant="primary" size="sm">
        TeraBox downloader
      </Badge>
      <h1 className="mt-5 text-display tracking-tight text-foreground">
        Paste a link. <span className="text-primary">Get your files.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-prose text-body text-muted-foreground">
        Browse, download, or stream anything from a TeraBox share link.
      </p>
    </div>
  )
}
