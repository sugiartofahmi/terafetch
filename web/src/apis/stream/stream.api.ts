import { getMockStream } from './stream.mock'
import type { TGetStreamParams, TGetStreamResponse } from './stream.type'

export const getStream = async (
  params: TGetStreamParams,
): Promise<TGetStreamResponse> => {
  return getMockStream(params)
}
