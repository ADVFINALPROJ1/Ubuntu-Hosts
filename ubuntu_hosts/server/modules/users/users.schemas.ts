import { pgTable, serial, varchar, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'
import { events } from '../../db/schema'  

export const rsvpStatusEnum = pgEnum('rsvp_status', ['Registered', 'Cancelled', 'Waitlisted'])

export const attendees = pgTable('attendees', {
  id:         serial('id').primaryKey(),
  event_id:   integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  name:       varchar('name', { length: 255 }).notNull(),
  email:      varchar('email', { length: 255 }).notNull(),
  status:     rsvpStatusEnum('status').notNull().default('Registered'),
  created_at: timestamp('created_at').defaultNow(),
})