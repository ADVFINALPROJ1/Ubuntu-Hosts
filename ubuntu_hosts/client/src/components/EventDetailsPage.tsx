import EventInformationPanel from "./EventInformationPanel";
import Navbar from "../NavBar";

const EventDetailsPage = () => {
  return (
    <>
    <Navbar />
    <div className="container mx-auto py-10">
      <EventInformationPanel />
    </div>
    </>
  );
};

export default EventDetailsPage;