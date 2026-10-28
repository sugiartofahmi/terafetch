import { useInfiniteQuery } from '@tanstack/react-query'
import { getResult } from './result.api'
import type { TGetResultResponse, TResultFilter } from './result.type'
import type { TAppError } from '@/integrations/axios/error'

export type TUseGetResultInfiniteOptions = {
  url: string
  folder?: string
  filter?: TResultFilter
  per_page?: number
}

export const useGetResultInfinite = ({
  url,
  folder,
  filter = 'all',
  per_page = 10,
}: TUseGetResultInfiniteOptions) => {
  const query = useInfiniteQuery<TGetResultResponse, TAppError>({
    queryKey: ['result', url, folder ?? null, filter, per_page],
    queryFn: ({ pageParam = 1 }) =>
      getResult({
        url,
        folder,
        filter,
        page: pageParam as number,
        per_page,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data.meta
      return meta.page < meta.total_page ? meta.page + 1 : undefined
    },
    enabled: Boolean(url),
  })

  const items = query.data?.pages.flatMap((page) => page.data.items) ?? []
  const total = query.data?.pages[0]?.data.meta.total ?? 0
  const isEmpty = !query.isLoading && items.length === 0

  return {
    ...query,
    items,
    total,
    isEmpty,
  }
}
