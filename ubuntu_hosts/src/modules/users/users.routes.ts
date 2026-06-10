import { Hono } from 'hono'
import {
  getEventForRSVP,
  checkDuplicateRSVP,
  registerAttendee,
  getAttendeesByEventId,
  isEventSoldOut,
  getEventAvailability,
} from './users.services'

const usersRoute = new Hono()

usersRoute.post('/events/:id/rsvp', async (c) => {
  const eventId = Number(c.req.param('id'))

  if (isNaN(eventId)) {
    return c.json({ error: 'Invalid event ID' }, 400)
  }

  const body = await c.req.json().catch(() => null)
  if (!body?.name || !body?.email) {
    return c.json({ error: 'Name and email are required' }, 400)
  }

  const { name, email } = body

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return c.json({ error: 'Invalid email address' }, 400)
  }

  const event = await getEventForRSVP(eventId)
  if (!event) {
    return c.json({ error: 'Event not found' }, 404)
  }

  if (isEventSoldOut(event)) {
    return c.json({ error: 'Event is sold out', soldOut: true }, 409)
  }

  const alreadyRegistered = await checkDuplicateRSVP(eventId, email.trim().toLowerCase())
  if (alreadyRegistered) {
    return c.json({ error: 'You have already registered for this event' }, 409)
  }

  const confirmation = await registerAttendee(eventId, event.title, { name, email })

  return c.json({
    message: 'Registration successful',
    confirmation,
  }, 201)
})

usersRoute.get('/events/:id/availability', async (c) => {
  const eventId = Number(c.req.param('id'))

  if (isNaN(eventId)) {
    return c.json({ error: 'Invalid event ID' }, 400)
  }

  const event = await getEventForRSVP(eventId)
  if (!event) {
    return c.json({ error: 'Event not found' }, 404)
  }

  const availability = getEventAvailability(event)
  return c.json({ availability })
})

function generateCSV(attendees: { name: string; email: string; status: string; registered_at: Date | null }[]): string {
  const headers = ['Name', 'Email', 'Status', 'Registered At']
  const rows = attendees.map(a => [
    `"${a.name.replace(/"/g, '""')}"`,
    `"${a.email.replace(/"/g, '""')}"`,
    `"${a.status}"`,
    `"${a.registered_at ? new Date(a.registered_at).toISOString() : ''}"`,
  ])
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

usersRoute.get('/events/:id/attendees/export', async (c) => {
  const eventId = Number(c.req.param('id'))

  if (isNaN(eventId)) {
    return c.json({ error: 'Invalid event ID' }, 400)
  }

  const event = await getEventForRSVP(eventId)
  if (!event) {
    return c.json({ error: 'Event not found' }, 404)
  }

  const attendees = await getAttendeesByEventId(eventId)
  const csv = generateCSV(attendees)

  return c.body(csv, 200, {
    'Content-Type': 'text/csv',
    'Content-Disposition': `attachment; filename="attendees-event-${eventId}.csv"`,
  })
})

export default usersRoute