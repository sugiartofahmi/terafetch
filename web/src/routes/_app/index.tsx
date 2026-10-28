import { createFileRoute } from '@tanstack/react-router'
import { HomeSkeleton } from '@/components/templates/home/components/home-skeleton'
import { HomeTemplate } from '@/components/templates/home/home-template'

export const Route = createFileRoute('/_app/')({
  pendingComponent: HomeSkeleton,
  component: HomeTemplate,
})
