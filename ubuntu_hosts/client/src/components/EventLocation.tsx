type Props = {
  venue: string;
  address: string;
};

const EventLocation = ({ venue, address }: Props) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        Venue
      </h2>

      <div className="rounded-lg border p-4">
        <p className="font-medium">{venue}</p>
        <p className="text-muted-foreground">
          {address}
        </p>
      </div>
    </div>
  );
};

export default EventLocation;