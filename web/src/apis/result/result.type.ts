import type { TApiListResponse, TPaginationParams } from '@/types/api.type'

export type TResultFilter = 'all' | 'video' | 'photo'

export type TFolderItem = {
  id: string
  type: 'folder'
  name: string
  item_count: number
}

export type TVideoItem = {
  id: string
  type: 'video'
  name: string
  size: number
  width: number
  height: number
  duration: number
  thumbnail_url: string
  stream_id?: string
  download_url?: string
}

export type TPhotoItem = {
  id: string
  type: 'photo'
  name: string
  size: number
  width: number
  height: number
  thumbnail_url: string
  download_url?: string
}

export type TResultItem = TFolderItem | TVideoItem | TPhotoItem

export type TBreadcrumbItem = {
  id: string
  name: string
}

export type TGetResultParams = TPaginationParams & {
  url: string
  folder?: string
  filter?: TResultFilter
}

export type TGetResultResponse = TApiListResponse<TResultItem>
