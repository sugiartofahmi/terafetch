import { afterEach, describe, expect, it } from 'vitest'
import { cookies } from './cookies'

afterEach(() => {
  cookies.clearAccessToken()
})

describe('cookies', () => {
  it('is not authenticated when no token is set', () => {
    expect(cookies.isAuthenticated()).toBe(false)
  })

  it('stores and reads back the access token', () => {
    cookies.setAccessToken('mock-token')
    expect(cookies.getAccessToken()).toBe('mock-token')
    expect(cookies.isAuthenticated()).toBe(true)
  })

  it('clears the access token', () => {
    cookies.setAccessToken('mock-token')
    cookies.clearAccessToken()
    expect(cookies.getAccessToken()).toBeNull()
    expect(cookies.isAuthenticated()).toBe(false)
  })
})
