import axios from 'axios'
import { describe, expect, it } from 'vitest'
import { normalizeError } from './error'

describe('normalizeError', () => {
  it('extracts error_message from backend response', () => {
    const error = new axios.AxiosError('Request failed with 400')
    error.response = {
      status: 400,
      data: {
        error_message: 'Invalid link parameter provided',
        errors: [{ field: 'url', message: 'Required' }],
        status_code: 400,
        version: '1.0.0',
      },
    } as any

    const normalized = normalizeError(error)
    expect(normalized.title).toBe('Invalid request')
    expect(normalized.message).toBe('Invalid link parameter provided')
    expect(normalized.status).toBe(400)
    expect(normalized.errors).toHaveLength(1)
    expect(normalized.retryable).toBe(false)
  })

  it('marks 429 and 500 status as retryable', () => {
    const rateLimitError = new axios.AxiosError('Rate limited')
    rateLimitError.response = {
      status: 429,
      data: {
        error_message: 'Too many requests. Please slow down.',
        errors: [],
        status_code: 429,
        version: '1.0.0',
      },
    } as any

    const normalized = normalizeError(rateLimitError)
    expect(normalized.retryable).toBe(true)
    expect(normalized.message).toBe('Too many requests. Please slow down.')
  })

  it('handles timeout errors as retryable', () => {
    const timeoutError = new axios.AxiosError('timeout of 30000ms exceeded')
    timeoutError.code = 'ECONNABORTED'

    const normalized = normalizeError(timeoutError)
    expect(normalized.title).toBe('Connection timeout')
    expect(normalized.retryable).toBe(true)
  })

  it('handles standard Error objects', () => {
    const err = new Error('Generic failure')
    const normalized = normalizeError(err)
    expect(normalized.title).toBe('Unexpected error')
    expect(normalized.message).toBe('Generic failure')
  })
})
