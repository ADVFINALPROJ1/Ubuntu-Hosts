import { eq } from 'drizzle-orm'
import { db } from '../../db/db'
import { events } from '../../db/schema'
import { CreateEventInput, UpdateEventInput } from './events.schemas'

export const createEvent = async (data: CreateEventInput) => {
  const [newEvent] = await db.insert(events).values({
    ...data,
    available_capacity: data.capacity,
  }).returning()
  return newEvent
}

export const getAllEvents = async () => {
  return await db.select().from(events)
}

export const getEventById = async (id: number) => {
  const [event] = await db.select().from(events).where(eq(events.id, id))
  return event
}

export const updateEvent = async (id: number, data: UpdateEventInput) => {
  const [updated] = await db.update(events).set(data).where(eq(events.id, id)).returning()
  return updated
}

export const deleteEvent = async (id: number) => {
  const [deleted] = await db.delete(events).where(eq(events.id, id)).returning()
  return deleted
}