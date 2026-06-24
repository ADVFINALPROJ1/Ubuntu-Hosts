import EventDetailsPage from "./components/EventDetailsPage";
import RSVPSection from "./components/RSVPSection";

function EventDetails() {
  return (
    <div className="container mx-auto space-y-10 py-10">
      <EventDetailsPage />
      <RSVPSection />
    </div>
  );
}

export default EventDetails;