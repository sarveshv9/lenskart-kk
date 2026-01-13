import React from 'react';
import useSmoothScroll from './hooks/useSmoothScroll';
import { useGSAPScrollZoom } from './hooks/useGSAPScrollZoom';
import Header from './components/Header';
import Hero from './components/Hero';
import SpecsCarousel from "./components/EyewearCarousel"; 
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import CustomCursor from './components/elements/CustomCursor';
import FooterGradient from './components/elements/FooterGradient';


import './styles/App.css';

const App = () => {
  useSmoothScroll();
  
  const zoomRef = useGSAPScrollZoom({
    maxScale: 1.25,
    minScale: 1,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  });

  return (
    <>
      <div id="nav-portal"></div>     
      <div className="smooth-wrapper">
        <div className="smooth-content">
          {/* Container for Header and Hero */}
          <div className="hero-background-container">
            <Header />
            <Hero />
          </div>   
          <SpecsCarousel />       
          <FooterGradient>
            <CTASection />
            <Footer />
          </FooterGradient>
        </div>
      </div>
      <CustomCursor />
    </>
  );
};

export default App;