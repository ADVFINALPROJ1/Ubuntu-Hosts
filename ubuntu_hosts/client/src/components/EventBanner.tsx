import { AspectRatio } from "./ui/aspect-ratio";

type Props = {
  imageUrl: string;
};

const EventBanner = ({ imageUrl }: Props) => {
  return (
    <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-xl">
      <img
        src={imageUrl}
        alt="Event Banner"
        className="h-full w-full object-cover"
      />
    </AspectRatio>
  );
};

export default EventBanner;