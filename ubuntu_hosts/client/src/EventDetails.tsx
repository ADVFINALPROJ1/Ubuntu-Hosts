import EventInformationPanel from "./components/EventInformationPanel";
import Navbar from "./NavBar";
import Footer from "./Footer";

function EventDetails() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto space-y-10 py-10">
        <div className="container mx-auto py-10">
          <EventInformationPanel />
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default EventDetails;
