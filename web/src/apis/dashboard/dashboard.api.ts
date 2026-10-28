import type { TDashboardActivity } from './dashboard.type'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getDashboardActivities = async (): Promise<
  Array<TDashboardActivity>
> => {
  await delay(500)
  // TODO real call: const { data } = await api.get<TDashboardActivity[]>('/dashboard/activities'); return data
  return []
}
