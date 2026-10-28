import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { toast } from 'sonner'
import type { EventClickArg } from '@fullcalendar/core'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const today = new Date()
const isoDate = (offsetDays: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

const mockEvents = [
  { title: 'Team sync', date: isoDate(0) },
  { title: 'Release cut', date: isoDate(2) },
  { title: 'Review', date: isoDate(5) },
]

const handleEventClick = (info: EventClickArg) => {
  toast(info.event.title, {
    description: new Date(info.event.startStr).toLocaleDateString(),
  })
}

export const ActivityCalendar = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Calendar</CardTitle>
    </CardHeader>
    <CardContent>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={mockEvents}
        eventClick={handleEventClick}
      />
    </CardContent>
  </Card>
)
