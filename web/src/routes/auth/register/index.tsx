import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterForm } from './-components/register-form'
import { cookies } from '@/libs/cookies'
import { match } from '@/libs/pattern'

export const Route = createFileRoute('/auth/register/')({
  beforeLoad: () => {
    match(cookies.isAuthenticated())
      .with(true, () => {
        throw redirect({ to: '/dashboard' })
      })
      .otherwise(() => {})
  },
  component: RegisterForm,
})
