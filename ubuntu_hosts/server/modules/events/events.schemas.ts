import { z } from "zod";

const CATEGORIES = [
  "CONCERT",
  "CONFERENCE",
  "WORKSHOP",
  "NETWORKING",
  "FESTIVAL",
  "SPORTS",
  "EXHIBITION",
  "WEBINAR",
  "SOCIAL_GATHERING",

  // Tech & Professional
  "HACKATHON",
  "MEETUP",
  "SEMINAR",
  "KEYNOTE",
  "PANEL_DISCUSSION",
  "JOB_FAIR",
  "PRODUCT_LAUNCH",

  // Entertainment & Culture
  "LIVE_MUSIC",
  "COMEDY_SHOW",
  "THEATER_ART",
  "NIGHTLIFE_PARTY",
  "FOOD_DRINK",
  "MOVIE_SCREENING",
  "GAMING_TOURNAMENT",

  // Fallback
  "OTHER",
];

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  capacity: z.number().min(1, "Capacity is required"),
  available_capacity: z.number().optional(),
  price: z.number().min(0, "Please provide a valid price"),
  category: z.string(),
  isRsvpRequired: z.boolean().default(true),
  imageUrl: z.string().default("https://drive.google.com/file/d/17O8lWsiK_BcZRaAJUIysnbZSrbzGf7PF/view?usp=sharing"),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
