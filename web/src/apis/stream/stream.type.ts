import type { TApiDetailResponse } from '@/types/api.type'

export type TStreamDetail = {
  id: string
  name: string
  size: number
  width: number
  height: number
  duration: number
  format: string
  poster_url: string
  stream_url: string
  download_url: string
}

export type TGetStreamParams = {
  id: string
  url: string
}

export type TGetStreamResponse = TApiDetailResponse<TStreamDetail>
