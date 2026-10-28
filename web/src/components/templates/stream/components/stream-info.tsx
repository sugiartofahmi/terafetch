import type { TStreamDetail } from '@/apis/stream/stream.type'
import { DownloadButton } from '@/components/common/download-button'
import { MetaPill } from '@/components/common/meta-pill'
import { formatBytes, formatDuration, formatResolution } from '@/libs/format'

export type TStreamInfoProps = {
  stream: TStreamDetail
}

export const StreamInfo = ({ stream }: TStreamInfoProps) => {
  const resolution = formatResolution(stream.width, stream.height)

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-h2 text-foreground" title={stream.name}>
          {stream.name}
        </h1>

        <ul className="mt-2 flex flex-wrap gap-2">
          {stream.size > 0 && <MetaPill>{formatBytes(stream.size)}</MetaPill>}
          {stream.duration > 0 && (
            <MetaPill>{formatDuration(stream.duration)}</MetaPill>
          )}
          {resolution && <MetaPill>{resolution}</MetaPill>}
          {stream.format && (
            <MetaPill className="uppercase">{stream.format}</MetaPill>
          )}
        </ul>
      </div>

      <div className="shrink-0">
        <DownloadButton
          filename={stream.name}
          downloadUrl={stream.download_url}
          size="lg"
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  )
}
