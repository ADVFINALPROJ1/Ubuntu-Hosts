type Props = {
  date: string;
  time: string;
};

const EventDateTime = ({ date, time }: Props) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">
        Date & Time
      </h2>

      <div className="rounded-lg border p-4">
        <p className="font-medium">{date}</p>
        <p className="text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};

export default EventDateTime;