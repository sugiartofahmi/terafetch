import { useQuery } from '@tanstack/react-query'
import { getDashboardActivities } from './dashboard.api'

export const useGetDashboardActivities = () => {
  const query = useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: getDashboardActivities,
  })

  return {
    ...query,
    activities: query.data ?? [],
    isEmpty: !query.isLoading && (query.data?.length ?? 0) === 0,
  }
}
