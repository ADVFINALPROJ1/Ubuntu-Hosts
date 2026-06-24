import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

type Props = {
  eventName: string;
  ticketQuantity: number;
  ticketPrice: number;
  timeLeft: string;
};

const OrderSummaryCard = ({
  eventName,
  ticketQuantity,
  ticketPrice,
  timeLeft,
}: Props) => {
  const totalPrice = ticketQuantity * ticketPrice;

  return (
    <Card className="w-full max-w-md">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Order Summary
          </h2>

          <Badge variant="destructive">
            {timeLeft}
          </Badge>
        </div>

        <Separator />

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
              Ticket Price
            </p>

            <p className="font-semibold">
              ${ticketPrice}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Total
          </p>

          <p className="text-2xl font-bold">
            ${totalPrice}
          </p>
        </div>

        <Button className="w-full">
          Proceed to Payment
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;