import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import { ArrowUpDown, MapPin, X } from "lucide-react";

export type SortOrder = "asc" | "desc";

export interface FilterState {
  location: string;
  sortOrder: SortOrder;
}

interface FilterBarProps {
  locations: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ locations, filters, onFilterChange }: FilterBarProps) {
  const handleLocation = (value: string) => {
    onFilterChange({ ...filters, location: value === "all" ? "" : value });
  };

  const handleSort = () => {
    onFilterChange({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  const handleReset = () => {
    onFilterChange({ location: "", sortOrder: "asc" });
  };

  const isFiltered = filters.location !== "" || filters.sortOrder !== "asc";

  return (
    <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 max-w-6xl mx-auto flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select
            value={filters.location === "" ? "all" : filters.location}
            onValueChange={handleLocation}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by location" />
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

        <Button variant="outline" onClick={handleSort} className="gap-2 shrink-0">
          <ArrowUpDown className="h-4 w-4" />
          Date: {filters.sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </Button>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="gap-2 shrink-0 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}