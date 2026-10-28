import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const weeklyActivity = [
  { day: 'Mon', count: 4 },
  { day: 'Tue', count: 7 },
  { day: 'Wed', count: 3 },
  { day: 'Thu', count: 9 },
  { day: 'Fri', count: 6 },
  { day: 'Sat', count: 2 },
  { day: 'Sun', count: 5 },
]

export const ActivityChart = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Activity this week</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeklyActivity}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="day"
            className="text-xs"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            className="text-xs"
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} className="fill-primary" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
