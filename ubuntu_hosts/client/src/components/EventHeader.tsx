import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
  title: string;
  category?: string;
};

const EventHeader = ({ title, category }: Props) => {
  return (
    <div className="space-y-3">
      <h1 className="text-4xl font-bold tracking-tight">
        {title}
      </h1>
      <Link        to="/">
      <Button size="lg">
        Register
      </Button>
</Link>
      {category && (
        <Badge variant="secondary">
          {category}
        </Badge>
      )}
    </div>
  );
};

export default EventHeader;