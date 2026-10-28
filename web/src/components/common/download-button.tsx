import { useSyncExternalStore } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getStream } from '@/apis/stream/stream.api'
import { Button } from '@/components/ui/button'
import {
  acquireDownloadLock,
  getDownloadLockSnapshot,
  releaseDownloadLock,
  subscribeDownloadLock,
} from '@/libs/download-lock'
import { cn } from '@/libs/utils'

export type TDownloadButtonProps = {
  filename: string
  downloadUrl?: string
  resolve?: {
    id: string
    url: string
  }
  size?: 'sm' | 'default' | 'lg'
  className?: string
  fullWidth?: boolean
}

export const DownloadButton = ({
  filename,
  downloadUrl,
  resolve,
  size = 'default',
  className,
  fullWidth = false,
}: TDownloadButtonProps) => {
  const lock = useSyncExternalStore(
    subscribeDownloadLock,
    getDownloadLockSnapshot,
    getDownloadLockSnapshot,
  )

  const isGlobalLocked = lock.locked
  const isThisDownloading = lock.locked && lock.activeFile === filename

  const handleDownload = async () => {
    if (!acquireDownloadLock(filename)) {
      return
    }

    try {
      let url = downloadUrl

      if (!url && resolve) {
        toast.info(`Preparing download for ${filename}`)
        const response = await getStream({
          id: resolve.id,
          url: resolve.url,
        })
        url = response.data.download_url
      }

      if (!url || !url.startsWith('http')) {
        toast.error(`Download is not available for ${filename}.`)
        return
      }

      toast.info(`Starting download for ${filename}`)

      const probe = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
      })

      if (!probe.ok && probe.status !== 206) {
        toast.error(`Failed to download ${filename}. Please try again.`)
        return
      }

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success(`Download started: ${filename}`)
    } catch {
      toast.error(`Failed to download ${filename}. Please try again.`)
    } finally {
      releaseDownloadLock()
    }
  }

  return (
    <Button
      type="button"
      size={size}
      aria-busy={isThisDownloading}
      aria-label={`Download ${filename}`}
      onClick={handleDownload}
      disabled={isGlobalLocked}
      className={cn(
        'font-semibold transition-all',
        fullWidth && 'w-full flex-1',
        className,
      )}
    >
      {isThisDownloading ? (
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
