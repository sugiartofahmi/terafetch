import { Link } from '@tanstack/react-router'
import type { TResultFilter } from '@/apis/result/result.type'
import { cn } from '@/libs/utils'

export type TFilterTabsProps = {
  url: string
  currentFilter: TResultFilter
}

const TABS: Array<{ label: string; value: TResultFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Videos', value: 'video' },
  { label: 'Photos', value: 'photo' },
]

export const FilterTabs = ({ url, currentFilter }: TFilterTabsProps) => {
  return (
    <div
      role="group"
      aria-label="Filter by type"
      className="flex gap-1 rounded-full border border-border bg-card p-1 shrink-0"
    >
      {TABS.map((tab) => {
        const isActive = currentFilter === tab.value

        return (
          <Link
            key={tab.value}
            to="/result"
            search={(prev) => ({
              ...prev,
              url,
              filter: tab.value,
            })}
            role="button"
            aria-pressed={isActive}
            className={cn(
              'inline-flex min-h-9 items-center justify-center rounded-full px-4 text-body-sm font-semibold transition-colors cursor-pointer',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
