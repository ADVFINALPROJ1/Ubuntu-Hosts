import { Hono } from 'hono'
import {
  getEventForRSVP,
  checkDuplicateRSVP,
  registerAttendee,
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

  if (event.available_capacity <= 0) {
    return c.json({ error: 'Event is fully booked' }, 409)
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

export default usersRoute