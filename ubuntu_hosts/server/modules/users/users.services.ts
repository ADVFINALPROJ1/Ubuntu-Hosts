import { eq, sql, and } from "drizzle-orm";
import { db } from "../../db/db";
import { attendees } from "./users.schemas";
import { events } from "../../db/schema";
import { getEventById } from "../events/events.services";
import { registrationConfirmationMail } from "../../lib/email";

export interface RSVPInput {
  name: string;
  email: string;
}

export interface RSVPConfirmation {
  attendee_id: number;
  name: string;
  email: string;
  status: string;
  event_id: number;
  event_title: string;
  registered_at: Date | null;
}

export async function getEventForRSVP(eventId: number) {
  const result = await db
    .select({
      id: events.id,
      title: events.title,
      capacity: events.capacity,
      available_capacity: events.available_capacity,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  return result[0] ?? null;
}

export function isEventSoldOut(
  event: { capacity: number; available_capacity: number } | null,
): boolean {
  if (!event) return true;
  return event.available_capacity <= 0;
}

export function getEventAvailability(
  event: { capacity: number; available_capacity: number } | null,
) {
  if (!event)
    return { status: "not_found", available: 0, total: 0, soldOut: true };
  return {
    status: event.available_capacity > 0 ? "available" : "sold_out",
    available: event.available_capacity,
    total: event.capacity,
    soldOut: event.available_capacity <= 0,
  };
}

export async function checkDuplicateRSVP(eventId: number, email: string) {
  const result = await db
    .select({ id: attendees.id })
    .from(attendees)
    .where(and(eq(attendees.event_id, eventId), eq(attendees.email, email)))
    .limit(1);

  return result.length > 0;
}

export async function registerAttendee(
  eventId: number,
  eventTitle: string,
  input: RSVPInput,
): Promise<RSVPConfirmation> {
  // Re-check availability right before inserting to reduce (not eliminate) race conditions
  const currentEvent = await getEventForRSVP(eventId);
  if (isEventSoldOut(currentEvent)) {
    throw new Error("Event is sold out");
  }

  const [newAttendee] = await db
    .insert(attendees)
    .values({
      event_id: eventId,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      status: "Registered",
    })
    .returning();

  await db
    .update(events)
    .set({ available_capacity: sql`${events.available_capacity} - 1` })
    .where(eq(events.id, eventId));

  const APP_MODE = process.env.APP_ENV;

  if (APP_MODE === "development") {
    // Send confirmation email
    try {
      const event = await getEventById(eventId);
      if (event) {
        await registrationConfirmationMail({
          to: newAttendee.email,
          name: newAttendee.name,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          attendeeId: newAttendee.id,
        });
      }
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }
  }

  return {
    attendee_id: newAttendee.id,
    name: newAttendee.name,
    email: newAttendee.email,
    status: newAttendee.status,
    event_id: eventId,
    event_title: eventTitle,
    registered_at: newAttendee.created_at,
  };
}

export interface AttendeeExport {
  id: number;
  name: string;
  email: string;
  status: string;
  registered_at: Date | null;
}

export async function getAttendeesByEventId(
  eventId: number,
): Promise<AttendeeExport[]> {
  const result = await db
    .select({
      id: attendees.id,
      name: attendees.name,
      email: attendees.email,
      status: attendees.status,
      created_at: attendees.created_at,
    })
    .from(attendees)
    .where(eq(attendees.event_id, eventId))
    .orderBy(attendees.created_at);

  return result.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    status: a.status,
    registered_at: a.created_at,
  }));
}

export async function getEventsByAttendeeEmail(email: string) {
  // Normalize the email input to match your registration logic
  const normalizedEmail = email.trim().toLowerCase();

  const userReservations = await db
    .select({
      attendee_id: attendees.id,
      event_id: events.id,
      title: events.title,
      date: events.date,
      time: events.time,
      location: events.location,
      price: events.price,
      category: events.category,
      isRsvpRequired: events.is_rsvp_required,
      imageUrl: events.image_url,
      status: attendees.status,
      registered_at: attendees.created_at,
    })
    .from(attendees)
    .innerJoin(events, eq(attendees.event_id, events.id))
    .where(eq(attendees.email, normalizedEmail))
    .orderBy(attendees.created_at);

  return userReservations;
}
