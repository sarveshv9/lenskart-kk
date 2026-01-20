import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/Hero.css';
import SparkleButton from '../components/elements/SparkleButton';
import CurvedImageLoop from '../hooks/useCurvedLoop';
import lenskartLogo from '../assets/lenskart_pattern.svg';

const Hero = React.memo(({ onSearchGig }) => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const curvedImageRef = useRef(null);
  const timelineRef = useRef(null);
  
  // Hook for navigation
  const navigate = useNavigate();

  // UPDATED: Submit handler now navigates to a new page
  const handleSubmit = useCallback(() => {
    // Navigate to the shop route
    navigate('/shop');

    if (onSearchGig) {
      onSearchGig('get-started');
    }
  }, [navigate, onSearchGig]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kill any existing animations
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Create main timeline
      const tl = gsap.timeline({ 
        defaults: { ease: "power3.out" }
      });

      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
        opacity: 0,
        y: 40
      });

      // Set curved image initial state (slide up from bottom)
      gsap.set(curvedImageRef.current, {
        opacity: 0,
        y: 100
      });

      // Animate main content first
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.0
      }, "-=0.6") 
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.2")
      // Animate curved image last
      .to(curvedImageRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.3");

      timelineRef.current = tl;

      // Mouse parallax effect
      const handleMouseMove = (e) => {
        const rect = heroRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(titleRef.current, {
          x: x * 15,
          y: y * 8,
          duration: 0.3,
          ease: "power2.out"
        });

        gsap.to(subtitleRef.current, {
          x: x * 8,
          y: y * 4,
          duration: 0.4,
          ease: "power2.out"
        });
      };

      const hero = heroRef.current;
      if (hero) {
        hero.addEventListener('mousemove', handleMouseMove);
        return () => {
          hero.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }, heroRef);

    // Cleanup on unmount
    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []); 

  return (
    <section ref={heroRef} className="hero" role="banner">
      <div className="hero-bg" aria-hidden="true"></div>
      
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Welcome To The Lenskart Store.
        </h1>

        <div ref={buttonRef} className="submit-form">
          <SparkleButton 
            text="Shop Now" 
            onClick={handleSubmit}
            ariaLabel="Navigate to shop page"
          />
        </div>
      </div>

      <div ref={curvedImageRef} className="hero-curved-images" style={{
        position: 'absolute',
        bottom: '60px', 
        left: '0',
        right: '0',
        width: '100%',
        height: '250px',
        zIndex: 10
      }}>
        <CurvedImageLoop
          imageSrc={lenskartLogo}
          speed={1.5}
          className="eyewear-carousel"
          curveAmount={300}
          direction="left"
          interactive={true}
          imageSize={200}
          spacing={60}
        />
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;