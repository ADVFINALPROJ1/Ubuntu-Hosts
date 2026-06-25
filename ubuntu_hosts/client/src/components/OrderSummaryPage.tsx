import { useEffect, useState } from "react";
import Navbar from "../NavBar";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

type Props = {
  eventName: string;
  ticketQuantity: number;
  ticketPrice: number;
  timeLeft: string;
  eventId: number;
  secondsLeft: number;
};

const OrderSummaryCard = ({
  eventName,
  ticketQuantity,
  ticketPrice,
  timeLeft,
  eventId,
  secondsLeft,
}: Props) => {
  const navigate = useNavigate();

  const totalPrice = ticketQuantity * ticketPrice;

  // Convert USD to ETB
  const totalETB = totalPrice * 55;

  const handleProceedToPayment = () => {
    // If countdown expired
    if (secondsLeft === 0) {
      alert(
        "Checkout reservation expired. Please confirm ticket quantity again from Event Details page."
      );

      // Redirect back to event details page
      navigate("/");

      return;
    }

    // Continue to checkout page
    navigate(
      `/checkout?quantity=${ticketQuantity}&price=${ticketPrice}&eventId=${eventId}`
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-6 p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <Badge variant="destructive">
            {timeLeft}
          </Badge>
        </div>

        <Separator />

        {/* Event details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Event
            </p>

            <p className="font-semibold">
              {eventName}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Ticket Quantity
            </p>

            <p className="font-semibold">
              {ticketQuantity}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Single Ticket Price
            </p>

            <p className="font-semibold">
              ETB {(ticketPrice * 55).toFixed(2)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Total
          </p>

          <p className="text-2xl font-bold">
            ETB {totalETB.toFixed(2)}
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </Button>
      </CardContent>
    </Card>
  );
};

const OrderSummaryPage = () => {
  const [secondsLeft, setSecondsLeft] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
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

  const eventId =
    Number(queryParams.get("eventId")) || 1;

  const minutes = Math.floor(secondsLeft / 60);

  const seconds = secondsLeft % 60;

  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
        <OrderSummaryCard
          eventName="Ethiopian Great Run 2026"
          ticketQuantity={quantity}
          ticketPrice={price}
          timeLeft={formattedTime}
          eventId={eventId}
          secondsLeft={secondsLeft}
        />
      </div>
    </>
  );
};

export default OrderSummaryPage;