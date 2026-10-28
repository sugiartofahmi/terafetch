import { createFileRoute } from '@tanstack/react-router'
import { ErrorState } from '@/components/common/error-state'
import { ResultSkeleton } from '@/components/templates/result/components/result-skeleton'
import { ResultTemplate } from '@/components/templates/result/result-template'
import { resultSearchSchema } from '@/apis/result/result.schema'

export const Route = createFileRoute('/_app/result/')({
  validateSearch: resultSearchSchema,
  pendingComponent: ResultSkeleton,
  errorComponent: ({ error, reset }) => (
    <main className="mx-auto mt-12 w-full max-w-page">
      <ErrorState
        error={error}
        title="Invalid Link Request"
        message={
          error.message || 'The requested result could not be displayed.'
        }
        onRetry={reset}
      />
    </main>
  ),
  component: () => <ResultTemplate search={Route.useSearch()} />,
})
