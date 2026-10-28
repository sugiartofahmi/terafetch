import { Fragment } from 'react/jsx-runtime'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ErrorState } from '@/components/common/error-state'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-svh items-center justify-center p-6">
      <ErrorState
        error={error}
        title="Application Error"
        message={error.message || 'An unexpected application error occurred.'}
        onRetry={reset}
      />
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-svh items-center justify-center p-6">
      <ErrorState
        title="Page not found"
        message="The page you are looking for does not exist."
      />
    </div>
  ),
  component: () => (
    <Fragment>
      <Outlet />
      <Toaster />
      {import.meta.env.DEV && (
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      )}
    </Fragment>
  ),
})
