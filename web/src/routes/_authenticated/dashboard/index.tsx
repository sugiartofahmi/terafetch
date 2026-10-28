import { createFileRoute } from '@tanstack/react-router'
import { ActivityCalendar } from './-components/activity-calendar'
import { ActivityChart } from './-components/activity-chart'
import { ActivityList } from './-components/activity-list'
import { useGetDashboardActivities } from '@/apis/dashboard/dashboard.hook'

const DashboardPage = () => {
  const { activities, isEmpty, isLoading } = useGetDashboardActivities()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <ActivityChart />
        <ActivityCalendar />
      </div>
      <ActivityList
        activities={activities}
        isLoading={isLoading}
        isEmpty={isEmpty}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: DashboardPage,
})
