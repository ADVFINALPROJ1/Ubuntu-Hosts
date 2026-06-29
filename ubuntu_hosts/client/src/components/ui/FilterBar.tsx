import { useState } from "react";
import { MapPin, CalendarArrowUp, CalendarArrowDown, X } from "lucide-react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// ── Types ────────────────────────────────────────────────────────────────────

export type SortOrder = "asc" | "desc";

export interface FilterState {
  location: string;
  sortOrder: SortOrder;
  category: string;
}

interface FilterBarProps {
  locations: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

// ── Category config ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "All",              value: "",                 dot: "#a3a3a3", bg: "bg-neutral-100", text: "text-neutral-700",  ring: "ring-neutral-300"  },
  { label: "Conference",       value: "CONFERENCE",       dot: "#3b82f6", bg: "bg-blue-50",     text: "text-blue-700",     ring: "ring-blue-200"     },
  { label: "Sports",           value: "SPORTS",           dot: "#22c55e", bg: "bg-green-50",    text: "text-green-700",    ring: "ring-green-200"    },
  { label: "Hackathon",        value: "HACKATHON",        dot: "#6366f1", bg: "bg-indigo-50",   text: "text-indigo-700",   ring: "ring-indigo-200"   },
  { label: "Theater & Art",    value: "THEATER_ART",      dot: "#c026d3", bg: "bg-fuchsia-50",  text: "text-fuchsia-700",  ring: "ring-fuchsia-200"  },
  { label: "Food & Drink",     value: "FOOD_DRINK",       dot: "#15803d", bg: "bg-green-50",    text: "text-green-800",    ring: "ring-green-300"    },
  { label: "Gaming",           value: "GAMING_TOURNAMENT",dot: "#dc2626", bg: "bg-red-50",      text: "text-red-700",      ring: "ring-red-200"      },
  { label: "Other",            value: "OTHER",            dot: "#737373", bg: "bg-neutral-100", text: "text-neutral-600",  ring: "ring-neutral-300"  },
];

// ── Component ────────────────────────────────────────────────────────────────

export function FilterBar({ locations, filters, onFilterChange }: FilterBarProps) {
  const activeCategory = filters.category || "All";
  const activeValue = filters.category;

 const handleCategory = (value: string) => {
  onFilterChange({ ...filters, category: value });
};

  const handleLocation = (value: string) => {
    onFilterChange({ ...filters, location: value === "all" ? "" : value });
  };

  const handleSort = (value: string) => {
    onFilterChange({ ...filters, sortOrder: value as SortOrder });
  };

  const handleReset = () => {
    onFilterChange({ location: "", sortOrder: "asc", category: "" });
  };

  const isFiltered =
    filters.location !== "" ||
    filters.sortOrder !== "asc" ||
    filters.category !== "";

  return (
    <div className="w-full max-w-5xl mx-auto px-1 pb-6 space-y-4 flex flex-col justify-center items-center">

         {/* ── Secondary controls ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Location */}
        <div className="flex items-center gap-2 min-w-[180px] flex-1 max-w-[260px]">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select
            value={filters.location === "" ? "all" : filters.location}
            onValueChange={handleLocation}
          >
            <SelectTrigger className="w-full rounded-full text-sm h-9 border-border/60 bg-muted/40 hover:bg-muted/70 transition-colors">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date sort */}
        <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-1 h-9">
          <button
            onClick={() => handleSort("asc")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-sm font-medium transition-all",
              filters.sortOrder === "asc"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CalendarArrowUp className="h-3.5 w-3.5" />
            Earliest
          </button>
          <button
            onClick={() => handleSort("desc")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-sm font-medium transition-all",
              filters.sortOrder === "desc"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CalendarArrowDown className="h-3.5 w-3.5" />
            Latest
          </button>
        </div>

        {/* Reset */}
        {isFiltered && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-full px-3 h-9 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* ── Category badge row ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeValue === cat.value
          return (
            <button
              key={cat.label}
               onClick={() => handleCategory(cat.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ring-1 select-none cursor-pointer",
                "hover:scale-105 active:scale-95",
                cat.bg,
                cat.text,
                isActive
                  ? `${cat.ring} ring-2 shadow-sm`
                  : "ring-transparent hover:ring-1 hover:ring-current/20 opacity-70 hover:opacity-100"
              )}
            >
              {/* coloured dot */}
              <span
                className="shrink-0 rounded-full"
                style={{
                  width: 9,
                  height: 9,
                  backgroundColor: cat.dot,
                  boxShadow: isActive ? `0 0 0 2px ${cat.dot}40` : "none",
                }}
              />
              {cat.label}
            </button>
          );
        })}
      </div>

    </div>
  );
}