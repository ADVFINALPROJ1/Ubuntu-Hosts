import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

import EventBanner from "./EventBanner";
import EventHeader from "./EventHeader";
import EventDescription from "./EventDescription";
import EventDateTime from "./EventDateTime";
import EventLocation from "./EventLocation";

const EventInformationPanel = () => {
  const event = {
    title: "Summer Music Festival 2026",
    category: "Music",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    description:
      "Join thousands of music lovers for an unforgettable night featuring live performances, food, entertainment, and special guests from around the world.",
    date: "August 12, 2026",
    time: "6:00 PM - 11:30 PM",
    venue: "Millennium Hall",
    address: "Addis Ababa, Ethiopia",
  };

  return (
    <Card className="mx-auto max-w-5xl">
      <CardContent className="space-y-8 p-6">
        <EventBanner imageUrl={event.imageUrl} />

        <EventHeader
          title={event.title}
          category={event.category}
        />

        <Separator />

        <EventDescription
          description={event.description}
        />

        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          <EventDateTime
            date={event.date}
            time={event.time}
          />

          <EventLocation
            venue={event.venue}
            address={event.address}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventInformationPanel;