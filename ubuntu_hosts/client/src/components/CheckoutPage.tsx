import CheckoutReservation from "./CheckoutReservation";
import Navbar from "../NavBar";

function CheckoutPage() {
  return (
    <>
    <Navbar />
    <div className="container mx-auto py-10">
      <CheckoutReservation />
    </div>
    </>
  );
}

export default CheckoutPage;