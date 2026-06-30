import { useRef, useState, useEffect } from "react";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface ScrollCarouselProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A lightweight, dependency-free horizontally scrollable carousel
 * using native CSS scroll-snap. Arrow buttons scroll by one "page"
 * (visible width) at a time. Buttons auto-disable at the ends.
 */
export function ScrollCarousel({ children, className }: ScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children]);

  const scrollByPage = (direction: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative group/carousel", className)}>
      {/* Left arrow */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => scrollByPage("left")}
        disabled={!canScrollLeft}
        className={cn(
          "absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full shadow-md bg-background",
          "opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0"
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Right arrow */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => scrollByPage("right")}
        disabled={!canScrollRight}
        className={cn(
          "absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full shadow-md bg-background",
          "opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0"
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Edge fade masks */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background to-transparent transition-opacity",
          canScrollLeft ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent transition-opacity",
          canScrollRight ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

export function ScrollCarouselItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "snap-start shrink-0 w-[260px] sm:w-[280px]",
        className
      )}
    >
      {children}
    </div>
  );
}