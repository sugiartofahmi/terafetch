import { Outlet, createFileRoute } from '@tanstack/react-router'
import { PublicLayout } from '@/components/layouts/public-layout'

export const Route = createFileRoute('/auth')({
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
})
