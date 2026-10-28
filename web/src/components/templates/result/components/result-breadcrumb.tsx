import { ChevronRight } from 'lucide-react'
import type { TBreadcrumbItem } from '@/apis/result/result.type'

export type TResultBreadcrumbProps = {
  path: Array<TBreadcrumbItem>
  onNavigateRoot: () => void
  onNavigateFolder: (index: number) => void
}

export const ResultBreadcrumb = ({
  path,
  onNavigateRoot,
  onNavigateFolder,
}: TResultBreadcrumbProps) => {
  const isRoot = path.length === 0

  return (
    <nav aria-label="Folder path">
      <ol className="flex flex-wrap items-center gap-1 text-body-sm">
        <li className="flex items-center gap-1">
          {isRoot ? (
            <span aria-current="page" className="font-semibold text-foreground">
              Shared files
            </span>
          ) : (
            <button
              type="button"
              onClick={onNavigateRoot}
              className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline transition-colors cursor-pointer"
            >
              Shared files
            </button>
          )}
        </li>

        {path.map((item, index) => {
          const isCurrent = index === path.length - 1

          return (
            <li key={item.id} className="flex items-center gap-1">
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              {isCurrent ? (
                <span
                  aria-current="page"
                  className="font-semibold text-foreground truncate max-w-[200px]"
                >
                  {item.name}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigateFolder(index)}
                  className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline transition-colors truncate max-w-[200px] cursor-pointer"
                >
                  {item.name}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
