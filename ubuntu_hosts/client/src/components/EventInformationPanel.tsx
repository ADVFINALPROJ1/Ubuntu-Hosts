import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import EventDateTime from "./EventDateTime";
import EventLocation from "./EventLocation";
import axios from "axios";
import { authClient } from "../lib/auth-client";
import { toast} from "sonner";

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  available_capacity: number;
  createdAt: Date;
  imageUrl: string;
  price: number;
  category: string;
  isRsvpRequired: boolean;
}
// ── API base URL ─────────────────────────────────────────────────────────────
if (!import.meta.env.APP_ENV) {
  throw new Error("There is no VITE_APP_ENV in your env file!");
}

const API: string =
  import.meta.env.APP_ENV === "production"
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.VITE_LOCAL_API;

// ── TicketSidebar ────────────────────────────────────────────────────────────
const TicketSidebar = ({
  price,
  available_capacity,
  eventId,
}: {
  price: number;
  capacity: number;
  available_capacity: number;
  eventId: number;
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  const isSoldOut = available_capacity === 0;
  const totalPrice = quantity * price;

  const increase = () => {
    if (quantity < available_capacity) setQuantity((q) => q + 1);
  };
  const decrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleGetTickets = async () => {
    if (isSoldOut) return;

    if (price === 0) {
      try {
        const response = await axios.post(`${API}/events/${eventId}/rsvp`, {
          name: userName,
          email: userEmail,
        });
        toast.success("Successfully reserved:");
        navigate('/')
      } catch (error) {
        toast.error("Failed to reserve spot");
      }

      return;
    }

    // Logic for paid tickets
    navigate(
      `/order-summary?quantity=${quantity}&price=${price}&eventId=${eventId}`,
    );
  };

  return (
    <Card className="sticky top-6 w-full max-w-sm">
      <CardContent className="space-y-5 p-6">
        {/* Organized by */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Organized by</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <span className="text-sm font-medium">
                GREAT ETHIOPIAN RUN PLC
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Attendees */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Attendees</p>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="font-semibold">
              {available_capacity === 0
                ? "0 spots left"
                : `${available_capacity} spots remaining`}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Purchase tickets for this event through the organizer's ticketing
            platform.
          </p>
        </div>

        {/* Ticket quantity selector */}
        {!isSoldOut && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Ticket Quantity</p>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={decrease}>
                −
              </Button>
              <span className="text-lg font-bold w-6 text-center">
                {quantity}
              </span>
              <Button variant="outline" size="sm" onClick={increase}>
                +
              </Button>
            </div>
          </div>
        )}

        {/* Price display */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-lg font-bold">
            {price === 0 ? "Free" : `ETB ${totalPrice.toFixed(2)}`}
          </p>
        </div>

        {/* Get Tickets button */}
        <Button
          className="w-full"
          disabled={isSoldOut}
          onClick={handleGetTickets}
        >
          {isSoldOut ? "Sold Out" : "Get Tickets"}
        </Button>

        {/* RSVP notice */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-1">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-amber-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-sm font-semibold text-amber-800">
              Reservation required
            </p>
          </div>
          <p className="text-xs text-amber-700">
            This is a Reservation-only event. You need to reserve a spot before
            attending. Walk-ins are not accepted.
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Reserve a spot at this event.
        </p>

        {!session && (
          <Link to="/signup">
            <Button className="w-full" disabled={isSoldOut}>
              {isSoldOut
                ? "No Spots Available"
                : "Sign in to Reserve Your Spot"}
            </Button>
          </Link>
        )}

        <Separator />
      </CardContent>
    </Card>
  );
};

// ── EventInformationPanel ────────────────────────────────────────────────────
const EventInformationPanel = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ event: Event }>(`${API}/events/${id}`)
      .then((res) => setEvent(res.data.event))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading event...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: main content */}
        <div className="flex-1 space-y-8">
          {/* Banner */}
          <div className="overflow-hidden rounded-xl">
            <img
              src={event.imageUrl || "/event_cover.jpg"}
              alt="Event Banner"
              className="w-full object-cover"
              style={{ maxHeight: "420px" }}
            />
          </div>

          {/* Title + category */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{event.category}</Badge>
              {event.isRsvpRequired && (
                <Badge
                  variant="outline"
                  className="text-amber-700 border-amber-400"
                >
                  📋 Reservation required
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">About Event</h2>
            <p className="text-muted-foreground leading-7 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <Separator />

          {/* Date & Venue */}
          <div className="grid gap-6 md:grid-cols-2">
            <EventDateTime date={event.date} time={event.time} />
            <EventLocation venue={event.location} address={event.location} />
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <TicketSidebar
            price={event.price}
            capacity={event.capacity}
            available_capacity={event.available_capacity}
            eventId={event.id}
          />
        </div>
      </div>
    </div>
  );
};

export default EventInformationPanel;
