import { eq, sql, and } from 'drizzle-orm'
import { db } from '../../db/db'                        
import { attendees } from './users.schemas'
import { events } from '../../db/schema'                
import { getEventById } from '../events/events.services' 

export interface RSVPInput {
  name:  string
  email: string
}

export interface RSVPConfirmation {
  attendee_id:   number
  name:          string
  email:         string
  status:        string
  event_id:      number
  event_title:   string
  registered_at: Date | null
}

export async function getEventForRSVP(eventId: number) {
  const result = await db
    .select({
      id:                 events.id,
      title:              events.title,
      capacity:           events.capacity,
      available_capacity: events.available_capacity,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1)

  return result[0] ?? null
}

export function isEventSoldOut(event: { capacity: number; available_capacity: number } | null): boolean {
  if (!event) return true
  return event.available_capacity <= 0
}

export function getEventAvailability(event: { capacity: number; available_capacity: number } | null) {
  if (!event) return { status: 'not_found', available: 0, total: 0, soldOut: true }
  return {
    status: event.available_capacity > 0 ? 'available' : 'sold_out',
    available: event.available_capacity,
    total: event.capacity,
    soldOut: event.available_capacity <= 0,
  }
}

export async function checkDuplicateRSVP(eventId: number, email: string) {
  const result = await db
  .select({ id: attendees.id })
  .from(attendees)
  .where(
    and(
      eq(attendees.event_id, eventId),
      eq(attendees.email, email)
    )
  )
  .limit(1)

  return result.length > 0
}

export async function registerAttendee(
  eventId: number,
  eventTitle: string,
  input: RSVPInput
): Promise<RSVPConfirmation> {
  const [newAttendee] = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(attendees)
      .values({
        event_id: eventId,
        name:     input.name.trim(),
        email:    input.email.trim().toLowerCase(),
        status:   'Registered',
      })
      .returning({
        id:         attendees.id,
        name:       attendees.name,
        email:      attendees.email,
        status:     attendees.status,
        created_at: attendees.created_at,
      })

    await tx
      .update(events)
      .set({ available_capacity: sql`${events.available_capacity} - 1` })
      .where(eq(events.id, eventId))

    return inserted
  })

  return {
    attendee_id:   newAttendee.id,
    name:          newAttendee.name,
    email:         newAttendee.email,
    status:        newAttendee.status,
    event_id:      eventId,
    event_title:   eventTitle,
    registered_at: newAttendee.created_at,
  }
}

export interface AttendeeExport {
  id: number
  name: string
  email: string
  status: string
  registered_at: Date | null
}

export async function getAttendeesByEventId(eventId: number): Promise<AttendeeExport[]> {
  const result = await db
    .select({
      id:         attendees.id,
      name:       attendees.name,
      email:      attendees.email,
      status:     attendees.status,
      created_at: attendees.created_at,
    })
    .from(attendees)
    .where(eq(attendees.event_id, eventId))
    .orderBy(attendees.created_at)

  return result.map(a => ({
    id: a.id,
    name: a.name,
    email: a.email,
    status: a.status,
    registered_at: a.created_at,
  }))
}