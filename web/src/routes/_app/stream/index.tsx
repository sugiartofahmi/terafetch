import { createFileRoute } from '@tanstack/react-router'
import { ErrorState } from '@/components/common/error-state'
import { StreamSkeleton } from '@/components/templates/stream/components/stream-skeleton'
import { StreamTemplate } from '@/components/templates/stream/stream-template'
import { streamSearchSchema } from '@/apis/stream/stream.schema'

export const Route = createFileRoute('/_app/stream/')({
  validateSearch: streamSearchSchema,
  pendingComponent: StreamSkeleton,
  errorComponent: ({ error, reset }) => (
    <main className="mx-auto mt-12 w-full max-w-page">
      <ErrorState
        error={error}
        title="Invalid Stream Request"
        message={error.message || 'The requested stream could not be loaded.'}
        onRetry={reset}
      />
    </main>
  ),
  component: () => <StreamTemplate search={Route.useSearch()} />,
})
