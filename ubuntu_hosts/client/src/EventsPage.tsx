import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import  Footer  from "./Footer";
import { EventCard, type Event } from "./components/ui/EventCard";
import { ScrollCarousel, ScrollCarouselItem } from "./components/ui/ScrollCarousel";
import { Badge } from "./components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import "./App.css";

// ── API base URL ─────────────────────────────────────────────────────────────
if (!import.meta.env.APP_ENV) {
  throw new Error("There is no APP_ENV in your env file!");
}

const API: string =
  import.meta.env.APP_ENV === "production"
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.VITE_LOCAL_API;

// Display config for each category section — order, label, and accent dot colour
const CATEGORY_SECTIONS: { value: string; label: string; dot: string }[] = [
  { value: "CONCERT",          label: "Concerts",          dot: "#f43f5e" },
  { value: "LIVE_MUSIC",       label: "Live Music",        dot: "#fb7185" },
  { value: "FESTIVAL",         label: "Festivals",         dot: "#eab308" },
  { value: "CONFERENCE",       label: "Conferences",       dot: "#3b82f6" },
  { value: "WORKSHOP",         label: "Workshops",         dot: "#f97316" },
  { value: "SEMINAR",          label: "Seminars",          dot: "#60a5fa" },
  { value: "KEYNOTE",          label: "Keynotes",          dot: "#2563eb" },
  { value: "PANEL_DISCUSSION", label: "Panel Discussions", dot: "#1d4ed8" },
  { value: "NETWORKING",       label: "Networking",        dot: "#ec4899" },
  { value: "MEETUP",           label: "Meetups",           dot: "#84cc16" },
  { value: "HACKATHON",        label: "Hackathons",        dot: "#6366f1" },
  { value: "JOB_FAIR",         label: "Job Fairs",         dot: "#0d9488" },
  { value: "PRODUCT_LAUNCH",   label: "Product Launches",  dot: "#14b8a6" },
  { value: "SPORTS",           label: "Sports",            dot: "#22c55e" },
  { value: "EXHIBITION",       label: "Exhibitions",       dot: "#a855f7" },
  { value: "THEATER_ART",      label: "Theater & Art",     dot: "#c026d3" },
  { value: "COMEDY_SHOW",      label: "Comedy Shows",      dot: "#fb923c" },
  { value: "MOVIE_SCREENING",  label: "Movie Screenings",  dot: "#0369a1" },
  { value: "GAMING_TOURNAMENT",label: "Gaming Tournaments",dot: "#dc2626" },
  { value: "NIGHTLIFE_PARTY",  label: "Nightlife & Parties", dot: "#7c3aed" },
  { value: "FOOD_DRINK",       label: "Food & Drink",      dot: "#15803d" },
  { value: "SOCIAL_GATHERING", label: "Social Gatherings", dot: "#06b6d4" },
  { value: "WEBINAR",          label: "Webinars",          dot: "#0d9488" },
  { value: "OTHER",            label: "More Events",       dot: "#737373" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    axios
      .get<{ events: Event[] }>(`${API}/events?limit=200`)
      .then((res) => setEvents(res.data.events))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const grouped = CATEGORY_SECTIONS.map((section) => ({
    ...section,
    events: events.filter((e) => e.category === section.value),
  })).filter((section) => section.events.length > 0);

  const locations = Array.from(new Set(events.map((e) => e.location))).sort();

  useEffect(() => {
    if (!selectedLocation && locations.length > 0) {
      setSelectedLocation(locations[0]);
    }
  }, [locations.join("|")]);

  const locationEvents = events.filter((e) => e.location === selectedLocation);

  return (
    <>
      <NavBar />

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <section className="px-6 pt-12 pb-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">All Events</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Browse events by category — scroll through each section to find
          something for you.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {loading && (
          <p className="text-center text-muted-foreground mt-16">
            Loading events...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 mt-16">Error: {error}</p>
        )}

        {!loading && !error && grouped.length === 0 && events.length === 0 && (
          <p className="text-center text-muted-foreground mt-16">
            No events available right now. Check back soon.
          </p>
        )}

        {/* ── All Events section ───────────────────────────────────────── */}
        {!loading && !error && events.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-foreground" />
              <h2 className="text-xl font-semibold tracking-tight">
                All Events
              </h2>
              <Badge variant="secondary" className="ml-1">
                {events.length}
              </Badge>
            </div>

            <ScrollCarousel>
              {events.map((evt) => (
                <ScrollCarouselItem key={evt.id}>
                  <EventCard event={evt} />
                </ScrollCarouselItem>
              ))}
            </ScrollCarousel>
          </section>
        )}

        {/* ── By Location section ──────────────────────────────────────── */}
        {!loading && !error && locations.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-blue-500" />
                <h2 className="text-xl font-semibold tracking-tight">
                  By Location
                </h2>
                <Badge variant="secondary" className="ml-1">
                  {locationEvents.length}
                </Badge>
              </div>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[200px] rounded-full text-sm h-9 border-border/60 bg-muted/40 hover:bg-muted/70 transition-colors">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {locationEvents.length > 0 ? (
              <ScrollCarousel>
                {locationEvents.map((evt) => (
                  <ScrollCarouselItem key={evt.id}>
                    <EventCard event={evt} />
                  </ScrollCarouselItem>
                ))}
              </ScrollCarousel>
            ) : (
              <p className="text-sm text-muted-foreground">
                No events found in {selectedLocation}.
              </p>
            )}
          </section>
        )}

        {!loading &&
          !error &&
          grouped.map((section) => (
            <section key={section.value} className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: section.dot }}
                />
                <h2 className="text-xl font-semibold tracking-tight">
                  {section.label}
                </h2>
                <Badge variant="secondary" className="ml-1">
                  {section.events.length}
                </Badge>
              </div>

              <ScrollCarousel>
                {section.events.map((evt) => (
                  <ScrollCarouselItem key={evt.id}>
                    <EventCard event={evt} />
                  </ScrollCarouselItem>
                ))}
              </ScrollCarousel>
            </section>
          ))}
      </div>

      <Footer />
    </>
  );
}