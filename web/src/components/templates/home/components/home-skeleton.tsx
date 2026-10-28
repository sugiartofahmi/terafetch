import { Skeleton } from '@/components/ui/skeleton'

export const HomeSkeleton = () => {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-12">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="h-6 w-36 rounded-full" />
        <Skeleton className="mt-5 h-12 w-3/4 max-w-md rounded-xl" />
        <Skeleton className="mt-4 h-5 w-2/3 max-w-sm" />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-2">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      <div className="mt-8 flex flex-col items-center">
        <Skeleton className="h-4 w-28" />
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </main>
  )
}
