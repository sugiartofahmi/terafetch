import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from './-components/login-form'
import { cookies } from '@/libs/cookies'
import { match } from '@/libs/pattern'

export const Route = createFileRoute('/auth/login/')({
  beforeLoad: () => {
    match(cookies.isAuthenticated())
      .with(true, () => {
        throw redirect({ to: '/dashboard' })
      })
      .otherwise(() => {})
  },
  component: LoginForm,
})
