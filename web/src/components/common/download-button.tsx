import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'

export type TDownloadButtonProps = {
  filename: string
  downloadUrl?: string
  size?: 'sm' | 'default' | 'lg'
  className?: string
  fullWidth?: boolean
}

export const DownloadButton = ({
  filename,
  downloadUrl,
  size = 'default',
  className,
  fullWidth = false,
}: TDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (isDownloading) return

    try {
      setIsDownloading(true)
      toast.info(`Starting download for ${filename}`)

      if (downloadUrl && downloadUrl.startsWith('http')) {
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800))
      }

      toast.success(`Download ready: ${filename}`)
    } catch {
      toast.error(`Failed to download ${filename}. Please try again.`)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      type="button"
      size={size}
      aria-busy={isDownloading}
      aria-label={`Download ${filename}`}
      onClick={handleDownload}
      disabled={isDownloading}
      className={cn(
        'font-semibold transition-all',
        fullWidth && 'w-full flex-1',
        className,
      )}
    >
      {isDownloading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <Download className="size-4" />
          <span>Download</span>
        </>
      )}
    </Button>
  )
}
