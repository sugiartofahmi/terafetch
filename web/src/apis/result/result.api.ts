import { getMockResult } from './result.mock'
import type { TGetResultParams, TGetResultResponse } from './result.type'

export const getResult = async (
  params: TGetResultParams,
): Promise<TGetResultResponse> => {
  return getMockResult(params)
}
