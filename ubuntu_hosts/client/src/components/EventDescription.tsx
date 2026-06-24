type Props = {
  description: string;
};

const EventDescription = ({ description }: Props) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">
        About Event
      </h2>

      <p className="text-muted-foreground leading-7">
        {description}
      </p>
    </div>
  );
};

export default EventDescription;