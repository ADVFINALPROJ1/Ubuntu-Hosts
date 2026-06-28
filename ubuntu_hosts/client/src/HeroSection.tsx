import "./App.css";
import { useState, useEffect, useRef } from "react";
import { initHalftoneBg } from "../public/halftone-bg";

const SUBTITLES = [
  "Discover local events and experiences happening right around you.",
  "Find concerts, markets, meetups and more.",
  "Connect with your community through shared experiences.",
  "Never miss what's happening near you again.",
];

const TITLES = [
  "Discover, Attend, Connect.",
  "Explore Local Scenes.",
  "Find Your Crowd.",
  "Share The Experience.",
  "Create The Moment.",
];

function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) initHalftoneBg(canvasRef.current);
  }, []);

  const [subIndex, setSubIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const [subTitle, setSubTitle] = useState(0);
  const [tVisible, setTVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setSubIndex((i) => (i + 1) % SUBTITLES.length);
        setVisible(true);
      }, 500);
    }, 3500);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setTVisible(false);
      setTimeout(() => {
        setSubTitle((i) => (i + 1) % TITLES.length);
        setTVisible(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          height: "80vh",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1 /* your existing flex layout */,
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              fontSize: "4rem",
              fontWeight: "900",
              padding: "1rem",
              transition: "opacity 0.2s ease, transform 0.2s ease",
              opacity: tVisible ? 1 : 0,
              transform: tVisible ? "translateY(0)" : "translateY(-12px)",
            }}
          >
            {TITLES[subTitle]}
          </h1>
          <h1
            style={{
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              fontSize: "1rem",
              fontWeight: "bold",
              padding: "0.3rem",
              transition: "opacity 0.5s ease, transform 0.5s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(-12px)",
            }}
          >
            {SUBTITLES[subIndex]}
          </h1>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
