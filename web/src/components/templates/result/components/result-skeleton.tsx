import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const ResultSkeleton = () => {
  return (
    <main className="mx-auto mt-10 w-full max-w-page">
      <div>
        <Skeleton className="h-4 w-72 max-w-full" />
        <Skeleton className="mt-2 h-9 w-28" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-11 w-56 rounded-full" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="flex flex-col">
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
    </main>
  )
}
