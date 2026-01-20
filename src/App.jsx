import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useSmoothScroll from './hooks/useSmoothScroll';
import { useGSAPScrollZoom } from './hooks/useGSAPScrollZoom';

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

import './styles/App.css';

// ==============================================
// 1. Extract Home Content into its own component
// ==============================================
const Home = () => {
  // Move this hook here so it only affects the Home page
  const zoomRef = useGSAPScrollZoom({
    maxScale: 1.25,
    minScale: 1,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  });

  return (
    <>
      {/* Attach ref={zoomRef} if you intended to zoom the background container */}
      <div className="hero-background-container" ref={zoomRef}>
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
  // Global Smooth Scroll runs on the wrapper
  useSmoothScroll();

  return (
    <Router>
      <div id="nav-portal"></div>     
      
      {/* Global Cursor stays outside routes to work everywhere */}
      <CustomCursor />

      <div className="smooth-wrapper">
        <div className="smooth-content">
          <Routes>
            {/* The Home Page */}
            <Route path="/" element={<Home />} />
            
            {/* The New Shop Page */}
            <Route path="/shop" element={<EyewearGrid />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;