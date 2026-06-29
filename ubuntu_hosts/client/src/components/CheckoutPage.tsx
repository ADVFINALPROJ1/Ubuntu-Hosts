import CheckoutReservation from "./CheckoutReservation";
import Navbar from "../NavBar";
import Footer from "../Footer";

function CheckoutPage() {
  return (
    <>
    <Navbar />
    <div className="container mx-auto py-10">
      <CheckoutReservation />
    </div>
    <Footer/>
    </>
  );
}

export default CheckoutPage;