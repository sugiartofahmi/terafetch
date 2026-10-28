import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, ClipboardPaste, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { isSupportedHost } from '@/libs/supported-hosts'

export const LinkForm = () => {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setUrl(text.trim())
        setError(null)
      }
    } catch {
      toast.error('Unable to access clipboard. Please paste manually.')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()

    if (!trimmed) {
      setError('Please paste a TeraBox share link.')
      return
    }

    try {
      new URL(trimmed)
    } catch {
      setError('Please enter a valid URL (starting with http:// or https://).')
      return
    }

    if (!isSupportedHost(trimmed)) {
      setError(
        'This domain is not recognized. Please use a supported TeraBox link.',
      )
      return
    }

    setError(null)
    navigate({
      to: '/result',
      search: {
        url: trimmed,
        filter: 'all',
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10" noValidate>
      <label htmlFor="url" className="sr-only">
        TeraBox share link
      </label>

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 transition-colors focus-within:border-primary sm:flex-row">
        <div className="flex flex-1 items-center gap-3 px-3">
          <Link2 className="size-5 shrink-0 text-muted-foreground" />
          <input
            id="url"
            type="url"
            inputMode="url"
            maxLength={500}
            placeholder="https://terabox.com/s/1abc…"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              if (error) setError(null)
            }}
            className="h-12 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePaste}
            className="min-h-11 px-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ClipboardPaste className="size-4" />
            <span>Paste</span>
          </Button>
        </div>

        <Button type="submit" size="xl" className="rounded-xl px-6">
          <span>Fetch</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-left text-body-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
