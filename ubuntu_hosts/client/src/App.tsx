import { Toaster } from 'sonner';
import './App.css'
import { SkeletonContainer } from './CardSkeleton'
import { EventCardPack } from './EventCard'
import NavBar from './NavBar'
import { useState } from 'react';


function App() {
   const [loading, setLoading] = useState(false);

  function loadingCheck() {
    setLoading(true);
  }

  return (
    <>
     <Toaster />
    <NavBar />

  
  <section className="hero-section" style={{padding:'1rem',backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.93)), url(/hero_section_bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    <h1 style={{ textAlign: 'center',fontFamily: 'Arial, sans-serif',fontSize: '4rem',fontWeight: '900',padding: '1rem' }}>Discover, Attend, Connect.</h1>
    <h1 style={{ textAlign: 'center',fontFamily: 'Arial, sans-serif',fontSize: '1rem',fontWeight: 'bold',padding: '0.3rem' }}>Discover local events and experiences happening right around you.</h1>

  </section>


  <section className="skeleton-container" style={{padding:'1rem'}}>

  <h1 style={{ textAlign: 'center',fontFamily: 'Arial, sans-serif',fontSize: '2rem',fontWeight: 'bold',padding: '1rem' }}>Trending Events</h1>


  {loading ? <SkeletonContainer /> :<> <EventCardPack /> <EventCardPack /> <EventCardPack /> </>}
   

  </section>
  </>
  )
}

export default App
