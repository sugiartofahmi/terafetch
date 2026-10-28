import { describe, expect, it } from 'vitest'
import { resultSearchSchema } from './result.schema'

describe('resultSearchSchema', () => {
  it('validates required url parameter', () => {
    const valid = resultSearchSchema.safeParse({
      url: 'https://terabox.com/s/1abc',
    })
    expect(valid.success).toBe(true)

    const invalid = resultSearchSchema.safeParse({
      url: 'invalid-url',
    })
    expect(invalid.success).toBe(false)
  })

  it('defaults filter to all', () => {
    const res = resultSearchSchema.parse({
      url: 'https://terabox.com/s/1abc',
    })
    expect(res.filter).toBe('all')
  })
})
