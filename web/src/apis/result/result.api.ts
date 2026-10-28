import { api } from '@/integrations/axios/api'
import type { TGetResultParams, TGetResultResponse } from './result.type'

export const getResult = async (
  params: TGetResultParams,
): Promise<TGetResultResponse> => {
  const { data } = await api.get<TGetResultResponse>('/result', { params })
  return data
}
