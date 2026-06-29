import { eq, sql } from 'drizzle-orm'
import { db } from '../../db/db'
import { events } from '../../db/schema'
import { attendees } from '../users/users.schemas'
import { CreateEventInput, UpdateEventInput } from './events.schemas'
import { eventUpdateAlertMail, eventCancellationAlertMail } from '../../lib/email'
import { desc, asc } from "drizzle-orm"; // Make sure to import these from drizzle


const VALID_CATEGORIES = [
  "CONCERT", "CONFERENCE", "WORKSHOP", "NETWORKING", "FESTIVAL",
  "SPORTS", "EXHIBITION", "WEBINAR", "SOCIAL_GATHERING", "HACKATHON",
  "MEETUP", "SEMINAR", "KEYNOTE", "PANEL_DISCUSSION", "JOB_FAIR",
  "PRODUCT_LAUNCH", "LIVE_MUSIC", "COMEDY_SHOW", "THEATER_ART",
  "NIGHTLIFE_PARTY", "FOOD_DRINK", "MOVIE_SCREENING", "GAMING_TOURNAMENT",
  "OTHER",
] as const;

type EventCategory = typeof VALID_CATEGORIES[number];

function isValidCategory(value: string): value is EventCategory {
  return (VALID_CATEGORIES as readonly string[]).includes(value);
}

export const createEvent = async (data: CreateEventInput) => {
  const [newEvent] = await db.insert(events).values({
    title: data.title,
    date: data.date,
    time: data.time,
    location: data.location,
    description: data.description,
    capacity: data.capacity,
    available_capacity: data.capacity,
    price: data.price,
    category: data.category as typeof events.$inferInsert.category,
    is_rsvp_required: data.isRsvpRequired,
    image_url: data.imageUrl,
  }).returning();
  return newEvent;
};

// change the options type signature
export const getAllEvents = async (options?: {
  page: number;
  limit: number;
  sortBy: "date" | "location";
  order: "asc" | "desc";
  category?: string;           // ← add this
}) => {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const sortBy = options?.sortBy ?? "date";
  const order = options?.order ?? "asc";
  const category = options?.category;   // ← add this
  const offset = (page - 1) * limit;

  const orderColumn = sortBy === "location" ? events.location : events.date;
  const orderByExpression = order === "desc" ? desc(orderColumn) : asc(orderColumn);

  // ← replace the two db calls with these
  const whereClause =
  category && isValidCategory(category)
    ? eq(events.category, category)
    : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(events)
    .where(whereClause);

  const rows = await db
    .select()
    .from(events)
    .where(whereClause)
    .orderBy(orderByExpression)
    .limit(limit)
    .offset(offset);

  return { events: rows, total: Number(count) };
};

export const getEventById = async (id: number) => {
  const [event] = await db.select().from(events).where(eq(events.id, id))
  return event
}

export async function getAttendeesForEvent(eventId: number) {
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

  const [updated] = await db.update(events).set({
    ...data,
    category: data.category as typeof events.$inferInsert.category,
  }).where(eq(events.id, id)).returning()

  
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