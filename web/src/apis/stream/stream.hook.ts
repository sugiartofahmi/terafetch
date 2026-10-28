import { useQuery } from '@tanstack/react-query'
import { getStream } from './stream.api'
import type { TGetStreamParams, TGetStreamResponse } from './stream.type'
import type { TAppError } from '@/integrations/axios/error'

export const useGetStream = ({ id, url }: TGetStreamParams) => {
  const query = useQuery<TGetStreamResponse, TAppError>({
    queryKey: ['stream', id, url],
    queryFn: () => getStream({ id, url }),
    enabled: Boolean(id && url),
  })

  return {
    ...query,
    stream: query.data?.data,
  }
}
