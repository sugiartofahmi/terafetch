import { describe, expect, it } from 'vitest'
import { formatBytes, formatDuration, formatResolution } from './format'

describe('formatBytes', () => {
  it('formats zero or negative values as 0 B', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(-100)).toBe('0 B')
  })

  it('formats bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 B')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(2.8 * 1024 * 1024)).toBe('2.8 MB')
    expect(formatBytes(151 * 1024 * 1024)).toBe('151 MB')
    expect(formatBytes(1.5 * 1024 * 1024 * 1024)).toBe('1.5 GB')
  })
})

describe('formatDuration', () => {
  it('formats seconds into mm:ss', () => {
    expect(formatDuration(15)).toBe('0:15')
    expect(formatDuration(60)).toBe('1:00')
    expect(formatDuration(596)).toBe('9:56')
  })

  it('formats hours into h:mm:ss', () => {
    expect(formatDuration(3665)).toBe('1:01:05')
  })

  it('handles negative or zero values', () => {
    expect(formatDuration(0)).toBe('0:00')
    expect(formatDuration(-10)).toBe('0:00')
  })
})

describe('formatResolution', () => {
  it('formats width and height as width×height', () => {
    expect(formatResolution(1920, 1080)).toBe('1920×1080')
    expect(formatResolution(3840, 2160)).toBe('3840×2160')
  })

  it('returns null if either width or height is missing', () => {
    expect(formatResolution(undefined, 1080)).toBeNull()
    expect(formatResolution(1920, undefined)).toBeNull()
    expect(formatResolution(0, 0)).toBeNull()
  })
})
