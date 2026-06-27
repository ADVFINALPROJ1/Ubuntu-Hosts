import { Toaster } from 'sonner';
import './App.css';
import { SkeletonContainer } from './CardSkeleton';
import { EventList } from './components/ui/EventCard';
import NavBar from './NavBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FilterBar, type FilterState } from './components/ui/FilterBar';

function App() {
  const [loading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    sortOrder: "asc",
  });
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get<{ events: { location: string }[] }>("http://localhost:3000/events?limit=100")
      .then((res) => {
        const unique = Array.from(
          new Set(res.data.events.map((e) => e.location))
        ).sort();
        setLocations(unique);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Toaster />
      <NavBar />

      <section
        className="hero-section"
        style={{
          padding: '1rem',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.93)), url(/hero_section_bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '4rem', fontWeight: '900', padding: '1rem' }}>
          Discover, Attend, Connect.
        </h1>
        <h1 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '1rem', fontWeight: 'bold', padding: '0.3rem' }}>
          Discover local events and experiences happening right around you.
        </h1>
      </section>

      <section className="skeleton-container" style={{ padding: '1rem' }}>
        <h1 style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '2rem', fontWeight: 'bold', padding: '1rem' }}>
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
          />
        )}
      </section>
    </>
  );
}

export default App;