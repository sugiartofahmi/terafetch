export const SUPPORTED_HOSTS = [
  'terabox.com',
  '1024terabox.com',
  '1024tera.com',
  'teraboxapp.com',
  'terabox.app',
  '4funbox.com',
  'mirrobox.com',
  'nephobox.com',
  'momerybox.com',
  'freeterabox.com',
  'terasharelink.com',
] as const

export const isSupportedHost = (urlString: string): boolean => {
  try {
    const url = new URL(urlString.trim())
    const host = url.hostname.toLowerCase()
    return SUPPORTED_HOSTS.some(
      (supported) => host === supported || host.endsWith(`.${supported}`),
    )
  } catch {
    return false
  }
}
