import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

type Props = {
  price: number;
  capacity: number;
};

const TicketCheckoutCard = ({
  price,
  capacity,
}: Props) => {
    const soldOut = capacity === 0;
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < capacity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalPrice = quantity * price;

  const handleCheckout = () => {
  if (soldOut) {
    alert("TICKETS ARE SOLD OUT");
    return;
  }

  navigate(
    `/checkout?quantity=${quantity}&price=${price}`
  );
};
  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Tickets
          </h2>

          <Badge variant={soldOut ? "destructive" : "secondary"}>
            {soldOut
              ? "Sold Out"
              : price === 0
              ? "Free"
              : `$${price}`}
          </Badge>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Remaining Capacity
          </p>

          <p className="text-3xl font-bold">
            {capacity}
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Ticket Quantity
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={decreaseQuantity}
            >
              -
            </Button>

            <span className="text-xl font-bold">
              {quantity}
            </span>

            <Button
              variant="outline"
              onClick={increaseQuantity}
            >
              +
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <p className="font-semibold">
            Total Price
          </p>

          <p className="text-2xl font-bold">
            ${totalPrice}
          </p>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full"
          variant={soldOut ? "destructive" : "default"}
        >
          {soldOut ? "Sold Out" : "Register Now"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TicketCheckoutCard;