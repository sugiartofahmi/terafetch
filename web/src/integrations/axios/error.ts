import axios from 'axios'
import type { TApiErrorResponse, TApiFieldError } from '@/types/api.type'

export type TAppError = {
  status?: number
  code?: string
  title: string
  message: string
  errors: Array<TApiFieldError>
  retryable: boolean
}

const getStatusTitle = (status?: number): string => {
  switch (status) {
    case 400:
      return 'Invalid request'
    case 404:
      return 'Link not found'
    case 410:
      return 'Link expired'
    case 429:
      return 'Too many requests'
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Server error'
    default:
      return status ? `Error ${status}` : 'Request failed'
  }
}

export const normalizeError = (error: unknown): TAppError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data as TApiErrorResponse | undefined

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        status,
        code: error.code,
        title: 'Connection timeout',
        message: 'The server took too long to respond. Please try again.',
        errors: [],
        retryable: true,
      }
    }

    if (!error.response) {
      const isOffline =
        typeof window !== 'undefined' && !window.navigator.onLine
      return {
        code: error.code || 'ERR_NETWORK',
        title: isOffline ? "You're offline" : 'Network error',
        message: isOffline
          ? 'Check your internet connection and try again.'
          : 'Unable to reach the server. Please check your connection and try again.',
        errors: [],
        retryable: true,
      }
    }

    if (data && typeof data === 'object' && 'error_message' in data) {
      return {
        status,
        code: error.code,
        title: getStatusTitle(status),
        message: data.error_message,
        errors: Array.isArray(data.errors) ? data.errors : [],
        retryable: [408, 429, 500, 502, 503, 504].includes(status ?? 0),
      }
    }

    return {
      status,
      code: error.code,
      title: getStatusTitle(status),
      message:
        typeof data === 'string'
          ? data
          : error.message || 'Something went wrong. Please try again.',
      errors: [],
      retryable: [408, 429, 500, 502, 503, 504].includes(status ?? 0),
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Unexpected error',
      message: error.message,
      errors: [],
      retryable: false,
    }
  }

  return {
    title: 'Unexpected error',
    message: 'An unknown error occurred. Please try again.',
    errors: [],
    retryable: false,
  }
}
