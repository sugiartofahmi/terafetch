import { SUPPORTED_HOSTS } from '@/libs/supported-hosts'

export const SupportedLinks = () => {
  return (
    <div className="mt-8 text-center">
      <h2 className="text-overline text-muted-foreground">Supported links</h2>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {SUPPORTED_HOSTS.map((host) => (
          <li
            key={host}
            className="rounded-full border border-border bg-secondary px-3 py-1 text-body-sm text-foreground"
          >
            {host}
          </li>
        ))}
      </ul>
    </div>
  )
}
