import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import EventBanner from "./EventBanner";
import EventDescription from "./EventDescription";
import EventDateTime from "./EventDateTime";
import EventLocation from "./EventLocation";

// Inline TicketSidebar — replaces RSVPSection + TicketCheckoutCard in the sidebar
const TicketSidebar = ({
  price,
  capacity,
  eventId,
}: {
  price: number;
  capacity: number;
  eventId: number;
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const soldOut = capacity === 0;
  const totalPrice = quantity * price;

  const increase = () => {
    if (quantity < capacity) setQuantity((q) => q + 1);
  };
  const decrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleGetTickets = () => {
    if (soldOut) return;
    navigate(
      `/order-summary?quantity=${quantity}&price=${price}&eventId=${eventId}`
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
              <span className="text-sm font-medium">GREAT ETHIOPIAN RUN PLC</span>
            </div>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg> */}
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
              {capacity === 0 ? "0 spots left" : `${capacity} spots remaining`}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Purchase tickets for this event through the organizer's ticketing platform.
          </p>
        </div>

        {/* Ticket quantity selector */}
        {!soldOut && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Ticket Quantity</p>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={decrease}>
                −
              </Button>
              <span className="text-lg font-bold w-6 text-center">{quantity}</span>
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
            {price === 0 ? "Free" : `ETB ${(totalPrice * 55).toFixed(2)}`}
          </p>
        </div>

        {/* Get Tickets button */}
        <Button
          className="w-full"
          disabled={soldOut}
          onClick={handleGetTickets}
        >
          {soldOut ? "Sold Out" : "Get Tickets"}
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
            <p className="text-sm font-semibold text-amber-800">Reservation required</p>
          </div>
          <p className="text-xs text-amber-700">
            This is a Reservation-only event. You need to reserve a spot before attending. Walk-ins are not
            accepted.
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Reserve a spot at this event.
        </p>
        <Link to="/signup">
        <Button
          className="w-full"
          onClick={handleGetTickets}
          disabled={soldOut}
        >
          {soldOut ? "No Spots Available" : "Sign in to Reserve Your Spot"}
        </Button>
        </Link>
        <Separator />

        {/* Discussion */}
        {/* <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="font-semibold">Discussion</p>
          </div>
          <p className="text-sm text-muted-foreground">Got questions? Something to discuss?</p>
          <p className="text-sm text-muted-foreground">Sign in to join the discussion.</p>
          <Button variant="outline" className="w-full" size="sm">
            Sign in to comment
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
};

const EventInformationPanel = () => {
  const event = {
    id: 1,
    title: "Ethiopian Great Run 2026",
    category: "Sports & Fitness",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200",
    description:
      "Get ready for the — Africa’s iconic road race experience! \nJoin thousands of runners and supporters in the vibrant streets of Addis Ababa for a day filled with energy, passion, fitness, and celebration 🎉🔥\n \nWhether you are running to compete, stay healthy, or simply enjoy the unforgettable atmosphere, this event brings together people from all walks of life for an inspiring experience ❤️🏅\n ✨ Live entertainment \n✨ Exciting community spirit \n✨ Memorable moments & achievements \n📅 Don’t miss your chance to be part of Ethiopia’s biggest running celebration in 2026. Register now and make every step count!",
    
      date: "August 12, 2026",
    time: "6:00 PM - 11:30 PM",
    venue: "Addis Ababa  main Streets",
    address: "Addis Ababa, Ethiopia",
    price: 25,
    capacity: 10000,
    isRsvpRequired: true,
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      {/* Two-column layout: main content + sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: main content */}
        <div className="flex-1 space-y-8">
          {/* Banner */}
          <div className="overflow-hidden rounded-xl">
            <img
              src={event.imageUrl}
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
                <Badge variant="outline" className="text-amber-700 border-amber-400">
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

          {/* Competitions list from image */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "🎭", label: "Cosplay Competition" },
              { icon: "🎮", label: "Gaming Tournament" },
              { icon: "📖", label: "Anime Story Arc Challenge" },
              { icon: "🍱", label: "Japanese Food Experience" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            ))}
          </div> */}

          <Separator />

          {/* Date & Venue */}
          <div className="grid gap-6 md:grid-cols-2">
            <EventDateTime date={event.date} time={event.time} />
            <EventLocation venue={event.venue} address={event.address} />
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <TicketSidebar
            price={event.price}
            capacity={event.capacity}
            eventId={event.id}
          />
        </div>
      </div>
    </div>
  );
};

export default EventInformationPanel;
