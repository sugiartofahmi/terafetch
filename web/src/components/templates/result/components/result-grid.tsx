import { FolderCard } from './folder-card'
import { MediaCard } from './media-card'
import type { TFolderItem, TResultItem } from '@/apis/result/result.type'
import { ErrorState } from '@/components/common/error-state'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useInView } from '@/hooks/use-in-view'

export type TResultGridProps = {
  items: Array<TResultItem>
  url: string
  onSelectFolder: (item: TFolderItem) => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage: () => void
  total?: number
  isError?: boolean
  error?: any
  refetch?: () => void
}

export const ResultGrid = ({
  items,
  url,
  onSelectFolder,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  total,
  isError,
  error,
  refetch,
}: TResultGridProps) => {
  const sentinelRef = useInView<HTMLDivElement>({
    enabled: Boolean(hasNextPage && !isFetchingNextPage),
    onInView: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          if (item.type === 'folder') {
            return (
              <FolderCard
                key={`folder-${item.id}`}
                item={item}
                onSelect={onSelectFolder}
              />
            )
          }

          return <MediaCard key={`media-${item.id}`} item={item} url={url} />
        })}

        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={`next-skeleton-${i}`} className="flex flex-col">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                </div>
              </div>
            </Card>
          ))}
      </div>

      <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

      {isError && items.length > 0 && (
        <ErrorState
          compact
          title="Could not load more files"
          message={error?.message || 'Please try again.'}
          onRetry={refetch || fetchNextPage}
        />
      )}

      {!hasNextPage && !isFetchingNextPage && items.length > 0 && (
        <p className="text-center text-caption text-muted-foreground pt-4 pb-8">
          You've reached the end{' '}
          {typeof total === 'number' && `· ${total} items`}
        </p>
      )}
    </div>
  )
}
