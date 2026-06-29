import { Toaster } from "sonner";
import "./App.css";
import { SkeletonContainer } from "./CardSkeleton";
import { EventList } from "./components/ui/EventCard";
import NavBar from "./NavBar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FilterBar, type FilterState } from "./components/ui/FilterBar";
import HeroSection from './HeroSection'
import Footer from './Footer'


// ── API base URL ─────────────────────────────────────────────────────────────
if (!import.meta.env.APP_ENV) {
  throw new Error("There is no VITE_APP_ENV in your env file!");
}

const API: string =
  import.meta.env.APP_ENV === "production"
    ? import.meta.env.VITE_PRODUCTION_API
    : import.meta.env.VITE_LOCAL_API;

function App() {
  const [loading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    sortOrder: "asc",
  });
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<{ events: { location: string }[] }>(`${API}/events?limit=100`)
      .then((res) => {
        const unique = Array.from(
          new Set(res.data.events.map((e) => e.location)),
        ).sort();
        setLocations(unique);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Toaster />
      <NavBar />

      <HeroSection />

      <section className="skeleton-container" style={{ padding: "1rem" }}>
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            fontSize: "2rem",
            fontWeight: "bold",
            padding: "1rem",
          }}
        >
          Trending Events
        </h1>

        <FilterBar
          locations={locations}
          filters={filters}
          onFilterChange={setFilters}
        />

        {loading ? (
          <SkeletonContainer />
        ) : (
          <EventList
            sortBy="date"
            order={filters.sortOrder}
            location={filters.location}
            category={filters.category} 
          />
        )}
      </section>

      <Footer />
    </>
  );
}

export default App;
