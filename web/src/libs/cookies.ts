const COOKIE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
} as const

type TCookieOptions = {
  expires?: number
  path?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

const isLocalhost = window.location.hostname === 'localhost'

const defaultOptions: TCookieOptions = {
  expires: 7,
  path: '/',
  secure: !isLocalhost,
  sameSite: 'Lax',
}

const setCookie = (
  name: string,
  value: string,
  options: TCookieOptions = {},
) => {
  const opts = { ...defaultOptions, ...options }
  const expires = new Date(
    Date.now() + (opts.expires ?? 7) * 24 * 60 * 60 * 1000,
  )

  let cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${opts.path}`
  if (opts.secure) cookie += '; Secure'
  if (opts.sameSite) cookie += `; SameSite=${opts.sameSite}`

  document.cookie = cookie
}

const getCookie = (name: string): string | null => {
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

const removeCookie = (name: string, path = '/') => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
}

export const cookies = {
  getAccessToken: () => getCookie(COOKIE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token: string) => setCookie(COOKIE_KEYS.ACCESS_TOKEN, token),
  clearAccessToken: () => removeCookie(COOKIE_KEYS.ACCESS_TOKEN),
  isAuthenticated: () => !!getCookie(COOKIE_KEYS.ACCESS_TOKEN),
}
