import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import { FilterBar, type FilterState } from "./ui/FilterBar";
import { AttendeesModal, type Event } from "./AttendeesModal";

// Extend your Event type to include location and date
export interface GridEvent extends Event {
  location: string;
  date: string; // ISO string e.g. "2025-06-01"
}

interface EventGridProps {
  events: GridEvent[];
}

export function EventGrid({ events }: EventGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    sortOrder: "asc",
  });
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Derive unique locations from events
  const locations = useMemo(
    () => Array.from(new Set(events.map((e) => e.location))).sort(),
    [events]
  );

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (filters.location) {
      result = result.filter((e) => e.location === filters.location);
    }

    result.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return filters.sortOrder === "asc" ? diff : -diff;
    });

    return result;
  }, [events, filters]);

  return (
    <>
      <AttendeesModal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />

      {/* Sticky Filter Bar */}
      <FilterBar
        locations={locations}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Event Count */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredEvents.length} of {events.length} events
        </p>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No events match the selected filters.
          </div>
        ) : (
          /* Event Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((evt) => (
              <Card key={evt.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{evt.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    {new Date(evt.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {evt.location}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="secondary">
                      {evt.attendees.length} attendee{evt.attendees.length !== 1 ? "s" : ""}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedEvent(evt)}
                    >
                      View Attendees
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}