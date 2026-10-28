import { Link } from '@tanstack/react-router'
import { Image as ImageIcon, Play, Video } from 'lucide-react'
import type { TPhotoItem, TVideoItem } from '@/apis/result/result.type'
import { DownloadButton } from '@/components/common/download-button'
import { FileMeta } from '@/components/common/file-meta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatDuration } from '@/libs/format'

export type TMediaCardProps = {
  item: TVideoItem | TPhotoItem
  url: string
}

export const MediaCard = ({ item, url }: TMediaCardProps) => {
  const isVideo = item.type === 'video'
  const streamId =
    ('stream_id' in item && item.stream_id) || item.id

  return (
    <Card className="flex flex-col">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={item.thumbnail_url}
          alt={item.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
        />

        <div className="absolute left-3 top-3">
          <Badge variant="overlay" size="sm" className="gap-1.5">
            {isVideo ? (
              <>
                <Video className="size-3.5" />
                <span>Video</span>
              </>
            ) : (
              <>
                <ImageIcon className="size-3.5" />
                <span>Photo</span>
              </>
            )}
          </Badge>
        </div>

        {isVideo && 'duration' in item && item.duration > 0 && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="square" size="xs">
              {formatDuration(item.duration)}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2
          className="truncate text-title font-semibold text-foreground"
          title={item.name}
        >
          {item.name}
        </h2>

        <FileMeta
          size={item.size}
          width={item.width}
          height={item.height}
          className="mt-1"
        />

        <div className="mt-4 flex gap-2 pt-auto">
          <DownloadButton
            filename={item.name}
            downloadUrl={item.download_url}
            resolve={
              item.type === 'photo' || item.download_url
                ? undefined
                : {
                    id: streamId,
                    url,
                  }
            }
            fullWidth
          />

          {isVideo && (
            <Button
              asChild
              variant="outline"
              className="flex-1 min-h-10 text-sm font-semibold hover:border-primary hover:text-primary"
            >
              <Link
                to="/stream"
                search={{
                  id: streamId,
                  url,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="size-4" />
                <span>Stream</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
