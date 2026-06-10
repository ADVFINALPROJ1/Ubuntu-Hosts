import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  capacity: integer('capacity').notNull().default(0),
  available_capacity: integer('available_capacity').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})