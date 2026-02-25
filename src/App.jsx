import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useSmoothScroll from './hooks/useSmoothScroll';
import { useGSAPScrollZoom } from './hooks/useGSAPScrollZoom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import SpecsCarousel from "./components/EyewearCarousel";
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import CustomCursor from './components/elements/CustomCursor';
import FooterGradient from './components/elements/FooterGradient';
import EyewearGrid from './components/EyewearGrid';
import AppointmentBooking from './components/AppointmentBooking';

import './styles/App.css';

// ==============================================
// 1. Extract Home Content into its own component
// ==============================================
const Home = () => {
  const containerRef = React.useRef(null);

  // Use GSAP to pin the Hero section and scale it down while scrolling to EyewearCarousel
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=100%", // Pin for the height of the viewport
      pin: true,
      pinSpacing: false, // Allows the next section to scroll over it
    });

    // Optional zoom effect mimicking useGSAPScrollZoom
    gsap.to(containerRef.current, {
      scale: 1.15,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        scrub: true,
      }
    });
  }, { scope: containerRef });

  return (
    <>
      <div className="hero-background-container" ref={containerRef}>
        <Header />
        <Hero />
      </div>
      <SpecsCarousel />
      <FooterGradient>
        <CTASection />
        <Footer />
      </FooterGradient>
    </>
  );
};

// ==============================================
// 2. Main App Component with Routing
// ==============================================
const App = () => {
  const location = useLocation();
  const disableSmoothScroll = location.pathname.startsWith('/shop') || location.pathname.startsWith('/book-appointment');

  // Global Smooth Scroll runs on the wrapper
  useSmoothScroll(disableSmoothScroll);

  return (
    <>
      <div id="nav-portal"></div>

      {/* Global Cursor stays outside routes to work everywhere */}
      <CustomCursor />

      <div className={disableSmoothScroll ? "" : "smooth-wrapper"}>
        <div className={disableSmoothScroll ? "" : "smooth-content"}>
          <Routes>
            {/* The Home Page */}
            <Route path="/" element={<Home />} />

            {/* The Shop Page */}
            <Route path="/shop" element={<EyewearGrid />} />

            {/* The Appointment Booking Page */}
            <Route path="/book-appointment" element={<AppointmentBooking />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;