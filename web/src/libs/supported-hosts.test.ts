import { describe, expect, it } from 'vitest'
import { isSupportedHost } from './supported-hosts'

describe('isSupportedHost', () => {
  it('returns true for supported domain URLs', () => {
    expect(isSupportedHost('https://terabox.com/s/1abc')).toBe(true)
    expect(isSupportedHost('https://1024terabox.com/s/105keF45-GEom02wwkJXcrQ')).toBe(
      true,
    )
    expect(isSupportedHost('https://www.1024terabox.com/s/abc')).toBe(true)
    expect(isSupportedHost('https://www.1024tera.com/s/123')).toBe(true)
    expect(isSupportedHost('https://teraboxapp.com/s/xyz')).toBe(true)
    expect(isSupportedHost('https://terasharelink.com/s/foo')).toBe(true)
  })

  it('returns false for unsupported domain URLs', () => {
    expect(isSupportedHost('https://google.com/search')).toBe(false)
    expect(isSupportedHost('https://youtube.com/watch')).toBe(false)
    expect(isSupportedHost('not-a-url')).toBe(false)
  })
})
