import { api } from '@/integrations/axios/api'
import type { TGetStreamParams, TGetStreamResponse } from './stream.type'

export const getStream = async (
  params: TGetStreamParams,
): Promise<TGetStreamResponse> => {
  const { data } = await api.get<TGetStreamResponse>('/stream', { params })
  return data
}
