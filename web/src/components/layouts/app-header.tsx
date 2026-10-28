import { AppLogo } from '@/components/common/app-logo'
import { Badge } from '@/components/ui/badge'

export const AppHeader = () => {
  return (
    <header className="mx-auto mt-4 flex w-full max-w-page items-center justify-between rounded-2xl border border-border glass px-5 py-3">
      <AppLogo />
      <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
        Free · No sign-up
      </Badge>
    </header>
  )
}
