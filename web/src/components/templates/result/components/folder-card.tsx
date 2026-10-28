import { ChevronRight, Folder } from 'lucide-react'
import type { TFolderItem } from '@/apis/result/result.type'

export type TFolderCardProps = {
  item: TFolderItem
  onSelect: (item: TFolderItem) => void
}

export const FolderCard = ({ item, onSelect }: TFolderCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="group flex w-full text-left items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary cursor-pointer"
    >
      <span className="grid size-14 place-items-center rounded-xl bg-accent text-primary shrink-0">
        <Folder className="size-7" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-title font-semibold text-foreground">
          {item.name}
        </span>
        <span className="text-body-sm text-muted-foreground">
          {item.item_count} {item.item_count === 1 ? 'item' : 'items'}
        </span>
      </span>

      <ChevronRight className="size-5 text-muted-foreground transition-colors group-hover:text-primary shrink-0" />
    </button>
  )
}
