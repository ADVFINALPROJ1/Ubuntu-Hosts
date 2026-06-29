import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  available_capacity: number;
  category: string;
  createdAt: Date;
}

// ── API base URL ─────────────────────────────────────────────────────────────
if (!import.meta.env.APP_ENV) {
  throw new Error("There is no APP_ENV in your env file!");
}

const API: string =
  import.meta.env.APP_ENV === "production"
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.VITE_LOCAL_API;

export function EventCard({ event }: { event: Event }) {
  const spotsLeft = event.available_capacity;
  const isSoldOut = spotsLeft === 0;

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 flex flex-col">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="./public/event_cover.jpg"
        alt={`${event.title} cover`}
        className="relative z-20 aspect-video w-full object-cover brightness-60 dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="destructive">{event.date}</Badge>
        </CardAction>
        <CardTitle>{event.title}</CardTitle>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              margin: "5px 0 0 0",
            }}
          >
            <MapPin style={{ width: "14px", height: "14px" }} />
            <Badge variant="secondary">{event.location}</Badge>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 0",
            }}
          >
            <Clock style={{ width: "14px", height: "14px" }} />
            <span className="text-sm text-muted-foreground">{event.time}</span>
            <Users
              style={{ width: "14px", height: "14px", margin: "0 0 0 10px" }}
            />
            <span className="text-sm text-muted-foreground">
              {isSoldOut
                ? "Sold out"
                : `${spotsLeft} of ${event.capacity} spots left`}
            </span>
          </div>
        </div>

        <CardDescription className="line-clamp-3 w-full">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Link to={`/details/${event.id}`} style={{ width: "100%" }}>
          <Button className="w-full" disabled={isSoldOut}>
            {isSoldOut ? "Sold Out" : "View Event"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

interface EventListProps {
  sortBy?: "date" | "location";
  order?: "asc" | "desc";
  location?: string;
  category?: string;
}

export function EventList({
  sortBy = "date",
  order = "asc",
  location = "",
  category = "",
}: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      sortBy,
      order,
      ...(location ? { location } : {}),
      ...(category ? { category } : {}),
    });

    setLoading(true);
    axios
      .get<{ events: Event[] }>(`${API}/events?${params.toString()}`)
      .then((res) => setEvents(res.data.events))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sortBy, order, location, category]);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!events.length)
    return <p className="text-center mt-10">No events found.</p>;

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((evt) => (
        <EventCard key={evt.id} event={evt} />
      ))}
    </div>
  );
}