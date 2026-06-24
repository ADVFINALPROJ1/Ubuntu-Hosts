import { Card, CardContent, CardHeader } from "./components/ui/card.js";
import { Skeleton } from "./components/ui/skeleton.js";

export function SkeletonCard() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}

export function SkeletonContainer() {
  return (
    <div
      className="skeleton"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.5rem 0rem",
      }}
    >
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
