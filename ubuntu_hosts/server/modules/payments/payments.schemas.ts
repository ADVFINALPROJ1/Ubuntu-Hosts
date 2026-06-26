import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// ─── Drizzle Table ───────────────────────────────────────────────────────────
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  event_id: integer("event_id").notNull(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull(),
  amount: integer("amount").notNull(),
  tx_ref: text("tx_ref").notNull().unique(),
  payment_status: text("payment_status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Zod Validation Schemas ──────────────────────────────────────────────────
export const initializePaymentSchema = z.object({
  event_id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  amount: z.number(),
});

export const verifyPaymentSchema = z.object({
  tx_ref: z.string().min(1, "Transaction reference is required"),
});
