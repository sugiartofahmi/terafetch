import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'

export type TVideoPlayerProps = {
  streamUrl: string
  posterUrl?: string
}

export const VideoPlayer = ({ streamUrl, posterUrl }: TVideoPlayerProps) => {
  const [readyUrl, setReadyUrl] = useState<string | null>(null)
  const [isPreparing, setIsPreparing] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    const prepare = async () => {
      setIsPreparing(true)
      setErrorMessage(null)
      setReadyUrl(null)

      try {
        const response = await fetch(streamUrl, {
          method: 'GET',
          headers: { Range: 'bytes=0-0' },
        })

        if (!response.ok && response.status !== 206) {
          throw new Error('Unable to prepare this video for playback.')
        }

        if (!cancelled) {
          setReadyUrl(streamUrl)
        }
      } catch {
        if (!cancelled) {
          setErrorMessage(
            'Unable to prepare this video for playback. Please try again.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsPreparing(false)
        }
      }
    }

    void prepare()

    return () => {
      cancelled = true
    }
  }, [streamUrl, attempt])

  if (isPreparing) {
    return (
      <div className="mt-4 grid aspect-video place-items-center rounded-2xl border border-border bg-background shadow-glow">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-body-sm font-medium">Preparing video…</p>
        </div>
      </div>
    )
  }

  if (errorMessage || !readyUrl) {
    return (
      <div className="mt-4">
        <ErrorState
          title="Playback unavailable"
          message={errorMessage || 'This video could not be loaded.'}
          onRetry={() => setAttempt((value) => value + 1)}
        />
      </div>
    )
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background shadow-glow">
      <video
        src={readyUrl}
        poster={posterUrl}
        controls
        autoPlay
        playsInline
        className="aspect-video w-full bg-background"
      />
    </div>
  )
}
