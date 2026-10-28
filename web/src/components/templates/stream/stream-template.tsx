import { BackLink } from './components/back-link'
import { StreamInfo } from './components/stream-info'
import { StreamSkeleton } from './components/stream-skeleton'
import { VideoPlayer } from './components/video-player'
import type { TStreamSearchParams } from '@/apis/stream/stream.schema'
import { ErrorState } from '@/components/common/error-state'
import { useGetStream } from '@/apis/stream/stream.hook'

export type TStreamTemplateProps = {
  search: TStreamSearchParams
}

export const StreamTemplate = ({ search }: TStreamTemplateProps) => {
  const { id, url } = search
  const { stream, isLoading, isError, error, refetch } = useGetStream({
    id,
    url,
  })

  if (isLoading) {
    return <StreamSkeleton />
  }

  if (isError || !stream) {
    return (
      <main className="mx-auto mt-8 w-full max-w-page">
        <BackLink url={url} />
        <ErrorState error={error} onRetry={refetch} className="my-12" />
      </main>
    )
  }

  return (
    <main className="mx-auto mt-8 w-full max-w-page">
      <BackLink url={url} />
      <VideoPlayer
        streamUrl={stream.stream_url}
        posterUrl={stream.poster_url}
      />
      <StreamInfo stream={stream} />
    </main>
  )
}
