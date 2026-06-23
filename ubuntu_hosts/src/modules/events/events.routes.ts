import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createEventSchema, updateEventSchema } from './events.schemas'
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from './events.services'
import { requireOrganizer, requireAuth } from '../../lib/middleware'

const eventRoutes = new Hono()

// PUBLIC — anyone can view events
eventRoutes.get('/', async (c) => {
  const rawPage = Number(c.req.query('page'))
  const rawLimit = Number(c.req.query('limit'))
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const limit = Number.isInteger(rawLimit) && rawLimit >= 10 && rawLimit <= 100 ? rawLimit : 10
  const sortBy = (c.req.query('sortBy') ?? 'date') as 'date' | 'location'
  const order = (c.req.query('order') ?? 'asc') as 'asc' | 'desc'
  const { events, total } = await getAllEvents({ page, limit, sortBy, order })
  const totalPages = Math.ceil(total / limit)
  return c.json({
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  })
})

// PUBLIC — anyone can view event details
eventRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const event = await getEventById(id)
  if (!event) return c.json({ message: 'Event not found' }, 404)
  return c.json({ event })
})

// PROTECTED — organizer only
eventRoutes.post('/', requireOrganizer, zValidator('json', createEventSchema), async (c) => {
  const data = c.req.valid('json')
  const event = await createEvent(data)
  return c.json({ message: 'Event created', event }, 201)
})

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