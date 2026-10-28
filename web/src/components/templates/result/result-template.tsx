import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FilterTabs } from './components/filter-tabs'
import { ResultBreadcrumb } from './components/result-breadcrumb'
import { ResultGrid } from './components/result-grid'
import { ResultHeader } from './components/result-header'
import { ResultSkeleton } from './components/result-skeleton'
import type { TResultSearchParams } from '@/apis/result/result.schema'
import type { TBreadcrumbItem, TFolderItem } from '@/apis/result/result.type'
import { EmptyState } from '@/components/common/empty-state'
import { ErrorState } from '@/components/common/error-state'
import { Button } from '@/components/ui/button'
import { useGetResultInfinite } from '@/apis/result/result.hook'

export type TResultTemplateProps = {
  search: TResultSearchParams
}

export const ResultTemplate = ({ search }: TResultTemplateProps) => {
  const { url, filter = 'all' } = search
  const navigate = useNavigate()

  const [currentFolder, setCurrentFolder] = useState<string | undefined>(
    undefined,
  )
  const [breadcrumbTrail, setBreadcrumbTrail] = useState<
    Array<TBreadcrumbItem>
  >([])

  const {
    items,
    total,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isEmpty,
  } = useGetResultInfinite({
    url,
    folder: currentFolder,
    filter,
    per_page: 10,
  })

  const handleSelectFolder = (folderItem: TFolderItem) => {
    setCurrentFolder(folderItem.id)
    setBreadcrumbTrail((prev) => [
      ...prev,
      { id: folderItem.id, name: folderItem.name },
    ])
  }

  const handleNavigateRoot = () => {
    setCurrentFolder(undefined)
    setBreadcrumbTrail([])
  }

  const handleNavigateFolder = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < breadcrumbTrail.length) {
      const target = breadcrumbTrail[targetIndex]
      setCurrentFolder(target.id)
      setBreadcrumbTrail((prev) => prev.slice(0, targetIndex + 1))
    }
  }

  if (isLoading) {
    return <ResultSkeleton />
  }

  return (
    <main className="mx-auto mt-10 w-full max-w-page">
      <ResultHeader url={url} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <ResultBreadcrumb
          path={breadcrumbTrail}
          onNavigateRoot={handleNavigateRoot}
          onNavigateFolder={handleNavigateFolder}
        />
        <FilterTabs url={url} currentFilter={filter} />
      </div>

      <div className="mt-6">
        {isError && items.length === 0 ? (
          <ErrorState error={error} onRetry={refetch} className="my-12" />
        ) : isEmpty ? (
          <EmptyState
            title="No files found"
            description={
              filter !== 'all'
                ? `There are no ${filter} files in this folder.`
                : 'This folder is currently empty.'
            }
            action={
              filter !== 'all' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate({
                      to: '/result',
                      search: { url, filter: 'all' },
                    })
                  }}
                >
                  Clear filter
                </Button>
              ) : undefined
            }
            className="my-12"
          />
        ) : (
          <ResultGrid
            items={items}
            url={url}
            onSelectFolder={handleSelectFolder}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            total={total}
            isError={isError}
            error={error}
            refetch={refetch}
          />
        )}
      </div>
    </main>
  )
}
