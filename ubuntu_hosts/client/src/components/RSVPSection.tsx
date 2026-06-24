import TicketCheckoutCard from "./TicketCheckoutCard";

const RSVPSection = () => {
  const ticketData = {
    price: 25,
    capacity: 42,
  };

  return (
    <div className="flex justify-center">
      <TicketCheckoutCard
        price={ticketData.price}
        capacity={ticketData.capacity}
      />
    </div>
  );
};

export default RSVPSection;