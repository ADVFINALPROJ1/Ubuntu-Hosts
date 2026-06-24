import { z } from "zod";

export const initializePaymentSchema = z.object({
  event_id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  amount: z.number(),
});