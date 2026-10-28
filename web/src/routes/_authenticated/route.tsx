import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { ProtectedLayout } from '@/components/layouts/protected-layout'
import { cookies } from '@/libs/cookies'
import { match } from '@/libs/pattern'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    match(cookies.isAuthenticated())
      .with(false, () => {
        throw redirect({ to: '/auth/login' })
      })
      .otherwise(() => {})
  },
  component: () => (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  ),
})
