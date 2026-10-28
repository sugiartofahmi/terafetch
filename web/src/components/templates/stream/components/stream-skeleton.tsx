import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const StreamSkeleton = () => {
  return (
    <main className="mx-auto mt-8 w-full max-w-page">
      <Skeleton className="h-9 w-32" />

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <Skeleton className="aspect-video w-full rounded-none" />
      </div>

      <Card className="mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 max-w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>

        <Skeleton className="h-11 w-32 rounded-lg" />
      </Card>
    </main>
  )
}
