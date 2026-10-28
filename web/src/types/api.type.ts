export type TApiResponse<TData> = {
  status_code: number
  data: TData
  version: string
}

export type TPaginationMeta = {
  total_page: number
  total: number
  page: number
  per_page: number
}

export type TPaginatedData<TItem> = {
  items: Array<TItem>
  meta: TPaginationMeta
}

export type TApiListResponse<TItem> = TApiResponse<TPaginatedData<TItem>>
export type TApiDetailResponse<TItem> = TApiResponse<TItem>

export type TPaginationParams = {
  page?: number
  per_page?: number
}

export type TApiFieldError = {
  field: string
  message: string
}

export type TApiErrorResponse = {
  error_message: string
  errors: Array<TApiFieldError>
  status_code: number
  version: string
}
