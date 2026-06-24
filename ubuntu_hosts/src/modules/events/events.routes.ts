import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createEventSchema, updateEventSchema } from './events.schemas'
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from './events.services'
import { requireOrganizer, requireAuth } from '../../lib/middleware'

const eventRoutes = new Hono()

eventRoutes.post('/', requireOrganizer, zValidator('json', createEventSchema), async (c) => {
  const data = c.req.valid('json')
  const event = await createEvent(data)
  return c.json({ message: 'Event created', event }, 201)
})

// PUBLIC — anyone can view events
eventRoutes.get('/', async (c) => {
  const events = await getAllEvents()
  return c.json({ events })
})

eventRoutes.get('/:id', requireAuth, async (c) => {
  const id = Number(c.req.param('id'))
  const event = await getEventById(id)
  if (!event) return c.json({ message: 'Event not found' }, 404)
  return c.json({ event })
})

// PROTECTED — organizer only
eventRoutes.put('/:id', requireOrganizer, zValidator('json', updateEventSchema), async (c) => {
  const id = Number(c.req.param('id'))
  const data = c.req.valid('json')
  const event = await updateEvent(id, data)
  if (!event) return c.json({ message: 'Event not found' }, 404)
  return c.json({ message: 'Event updated', event })
})

eventRoutes.delete('/:id', requireOrganizer, async (c) => {
  const id = Number(c.req.param('id'))
  const event = await deleteEvent(id)
  if (!event) return c.json({ message: 'Event not found' }, 404)
  return c.json({ message: 'Event deleted', event })
})

export default eventRoutes