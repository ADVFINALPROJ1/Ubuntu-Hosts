import { useEffect, useState } from "react";
import OrderSummaryCard from "./OrderSummaryCard";

const CheckoutReservation = () => {
  const [secondsLeft, setSecondsLeft] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const queryParams = new URLSearchParams(
    window.location.search
  );

  const quantity =
    Number(queryParams.get("quantity")) || 1;

  const price =
    Number(queryParams.get("price")) || 25;

  const minutes = Math.floor(secondsLeft / 60);

  const seconds = secondsLeft % 60;

  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="flex justify-center">
      <OrderSummaryCard
        eventName="Summer Music Festival 2026"
        ticketQuantity={quantity}
        ticketPrice={price}
        timeLeft={formattedTime}
      />
    </div>
  );
};

export default CheckoutReservation;