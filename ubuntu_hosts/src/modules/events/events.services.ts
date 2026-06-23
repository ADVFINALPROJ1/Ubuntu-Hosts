import { eq } from 'drizzle-orm'
import { db } from '../../db/db'
import { events } from '../../db/schema'
import { attendees } from '../users/users.schemas'
import { CreateEventInput, UpdateEventInput } from './events.schemas'
import { eventUpdateAlertMail, eventCancellationAlertMail } from '../../lib/email'

export const createEvent = async (data: CreateEventInput) => {
  const [newEvent] = await db.insert(events).values(data).returning()
  return newEvent
}

export const getAllEvents = async () => {
  return await db.select().from(events)
}

export const getEventById = async (id: number) => {
  const [event] = await db.select().from(events).where(eq(events.id, id))
  return event
}

async function getAttendeesForEvent(eventId: number) {
  return await db
    .select({
      name: attendees.name,
      email: attendees.email,
    })
    .from(attendees)
    .where(eq(attendees.event_id, eventId))
}

export const updateEvent = async (id: number, data: UpdateEventInput) => {
  const oldEvent = await getEventById(id)
  if (!oldEvent) return null

  const [updated] = await db.update(events).set(data).where(eq(events.id, id)).returning()
  
  if (updated) {
    const attendeesList = await getAttendeesForEvent(id)
    
    const oldDate = oldEvent.date
    const newDate = updated.date ?? oldEvent.date
    const oldTime = oldEvent.time
    const newTime = updated.time ?? oldEvent.time
    const oldLocation = oldEvent.location
    const newLocation = updated.location ?? oldEvent.location

    const hasChanges = oldDate !== newDate || oldTime !== newTime || oldLocation !== newLocation

    if (hasChanges && attendeesList.length > 0) {
      for (const attendee of attendeesList) {
        try {
          await eventUpdateAlertMail({
            to: attendee.email,
            name: attendee.name,
            eventTitle: updated.title,
            oldDate,
            newDate,
            oldTime,
            newTime,
            oldLocation,
            newLocation,
          })
        } catch (error) {
          console.error(`Failed to send update email to ${attendee.email}:`, error)
        }
      }
    }
  }

  return updated
}

export const deleteEvent = async (id: number) => {
  const oldEvent = await getEventById(id)
  if (!oldEvent) return null

  const attendeesList = await getAttendeesForEvent(id)

  const [deleted] = await db.delete(events).where(eq(events.id, id)).returning()

  if (deleted && attendeesList.length > 0) {
    for (const attendee of attendeesList) {
      try {
        await eventCancellationAlertMail({
          to: attendee.email,
          name: attendee.name,
          eventTitle: oldEvent.title,
          eventDate: oldEvent.date,
          eventTime: oldEvent.time,
          eventLocation: oldEvent.location,
        })
      } catch (error) {
        console.error(`Failed to send cancellation email to ${attendee.email}:`, error)
      }
    }
  }

  return deleted
}