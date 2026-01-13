import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/Header.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '../assets/lenskart_logo.png';

gsap.registerPlugin(ScrollTrigger);

const Header = ({ onSubmitReview }) => {
  const navContainerRef = useRef(null);
  const navLinksRef = useRef(null);
  const dotsRef = useRef(null);
  const navRef = useRef(null);
  const [navPortal, setNavPortal] = useState(null);

  useEffect(() => {
    let portalContainer = document.getElementById('nav-portal');
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = 'nav-portal';
      document.body.appendChild(portalContainer);
    }
    setNavPortal(portalContainer);
  }, []);

  useGSAP(() => {
    if (!navPortal || !navContainerRef.current) {
      console.log('Missing portal or nav container');
      return; 
    }
    
    let currentScrollProgress = 0;
    let isHovered = false;
    
    const navContainer = navContainerRef.current;
    const navLinks = navLinksRef.current;
    const dots = dotsRef.current;
    const nav = navRef.current;
    
    gsap.set([navContainer, nav, navLinks, dots], {
      clearProps: "all"
    });
    
    gsap.set(navContainer, {
      scale: 1,
      transformOrigin: "center center",
      force3D: true
    });
    
    gsap.set(nav, {
      scale: 1,
      transformOrigin: "center center",
      force3D: true
    });
    
    gsap.set(navLinks, {
      scale: 1,
      opacity: 1,
      y: 0,
      transformOrigin: "center center",
      force3D: true
    });
    
    gsap.set(dots, {
      scale: 1,
      opacity: 0,
      y: 10,
      pointerEvents: 'none',
      transformOrigin: "center center",
      force3D: true
    });
    
    const navLinkElements = navLinks.querySelectorAll('.nav-link');
    gsap.set(navLinkElements, {
      scale: 1,
      transformOrigin: "center center",
      force3D: true
    });
    
    gsap.delayedCall(0.1, () => {
      ScrollTrigger.refresh();
      
      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: '.header',
        start: 'bottom top+=100',
        end: 'bottom top+=20',
        scrub: 1,
        markers: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          currentScrollProgress = self.progress;
          
          if (!isHovered && self.progress > 0) {
            const scaleValue = gsap.utils.interpolate(1, 0.7, self.progress); // Reduced scale for better appearance
            
            const scaleTl = gsap.timeline();
            
            scaleTl
              .to(navContainer, {
                scale: scaleValue,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0)
              .to(nav, {
                scale: 1,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0)
              .to(navLinks, {
                scale: 1,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0)
              .to(navLinkElements, {
                scale: 1,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0)
              .to(dots, {
                scale: 1,
                duration: 0.1,
                ease: 'none',
                transformOrigin: "center center",
                force3D: true
              }, 0);

            if (self.progress > 0.3) {
              const linkOpacity = gsap.utils.interpolate(1, 0, (self.progress - 0.3) / 0.4);
              const linkY = gsap.utils.interpolate(0, -15, (self.progress - 0.3) / 0.4);
              
              scaleTl.to(navLinks, {
                opacity: linkOpacity,
                y: linkY,
                duration: 0.1,
                ease: 'none'
              }, 0);
            }

            if (self.progress > 0.6) {
              const dotOpacity = gsap.utils.interpolate(0, 1, (self.progress - 0.6) / 0.4);
              const dotY = gsap.utils.interpolate(10, 0, (self.progress - 0.6) / 0.4);
              
              scaleTl.to(dots, {
                opacity: dotOpacity,
                y: dotY,
                duration: 0.1,
                ease: 'none'
              }, 0);
              
              gsap.set(dots, { pointerEvents: 'auto' });
            } else {
              // Explicitly set dots to be hidden when progress is below 0.6
              scaleTl.to(dots, {
                opacity: 0,
                y: 10,
                duration: 0.1,
                ease: 'none'
              }, 0);
              gsap.set(dots, { pointerEvents: 'none' });
            }
          }
        },
        onRefresh: () => {
          gsap.set(navContainer, { scale: 1, transformOrigin: "center center" });
          gsap.set(nav, { scale: 1, transformOrigin: "center center" });
          gsap.set(navLinks, { scale: 1, opacity: 1, y: 0, transformOrigin: "center center" });
          gsap.set(navLinkElements, { scale: 1, transformOrigin: "center center" });
          gsap.set(dots, { scale: 1, opacity: 0, y: 10, pointerEvents: 'none', transformOrigin: "center center" });
        }
      });

      const handleMouseEnter = () => {
        isHovered = true;
        if (currentScrollProgress > 0) {
          const expandTl = gsap.timeline();
          
          expandTl
            .to(navContainer, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to([nav, navLinks], {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to(navLinkElements, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to(dots, {
              scale: 1,
              opacity: 0, 
              y: 10, 
              pointerEvents: 'none', 
              duration: 0.2
            }, 0)
            .to(navLinks, { 
              opacity: 1, 
              y: 0, 
              duration: 0.3 
            }, 0.1);
        }
      };

      const handleMouseLeave = () => {
        isHovered = false;
        if (currentScrollProgress > 0) {
          const scaleValue = gsap.utils.interpolate(1, 0.7, currentScrollProgress); // Reduced scale for better appearance
          
          const compactTl = gsap.timeline();
          
          compactTl
            .to(navContainer, {
              scale: scaleValue,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to([nav, navLinks], {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to(navLinkElements, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0)
            .to(dots, {
              scale: 1,
              duration: 0.4,
              ease: 'power2.out',
              transformOrigin: "center center",
              force3D: true
            }, 0);

          if (currentScrollProgress > 0.3) {
            const linkOpacity = gsap.utils.interpolate(1, 0, (currentScrollProgress - 0.3) / 0.4);
            const linkY = gsap.utils.interpolate(0, -15, (currentScrollProgress - 0.3) / 0.4);
            compactTl.to(navLinks, { 
              opacity: linkOpacity, 
              y: linkY, 
              duration: 0.2 
            }, 0);
          }

          if (currentScrollProgress > 0.6) {
            const dotOpacity = gsap.utils.interpolate(0, 1, (currentScrollProgress - 0.6) / 0.4);
            const dotY = gsap.utils.interpolate(10, 0, (currentScrollProgress - 0.6) / 0.4);
            compactTl.to(dots, { 
              opacity: dotOpacity, 
              y: dotY, 
              pointerEvents: 'auto', 
              duration: 0.3 
            }, 0.1);
          } else {
            // Explicitly set dots to be hidden when progress is below 0.6
            compactTl.to(dots, { 
              opacity: 0, 
              y: 10, 
              pointerEvents: 'none', 
              duration: 0.3 
            }, 0.1);
          }
        }
      };

      navContainer.addEventListener('mouseenter', handleMouseEnter);
      navContainer.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        navContainer.removeEventListener('mouseenter', handleMouseEnter);
        navContainer.removeEventListener('mouseleave', handleMouseLeave);
        scrollTriggerInstance.kill();
      };
    });
  }, [navPortal]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const NavigationComponent = () => (
    <div className="nav-container gsap-nav" ref={navContainerRef} style={{
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      transformOrigin: 'center center',
      zIndex: 1000,
      opacity: 1,
      animation: 'none'
    }}>
      <nav className="nav" ref={navRef}>
        <div className="nav-links" ref={navLinksRef}>
          <a 
            href="#home" 
            data-section="hero"
            className="nav-link" 
            onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection('header'); 
            }}
          >
            Home
          </a>
          <a 
            href="#eyewear-carousel" 
            data-section="htw"
            className="nav-link" 
            onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection('eyewear-carousel'); 
            }}
          >
            Categories
          </a>
          <a 
            href="#footer" 
            data-section="support"
            className="nav-link" 
            onClick={(e) => { 
              e.preventDefault(); 
              scrollToSection('footer'); 
            }}
          >
            Support
          </a>
        </div>

        <div className="nav-dots" ref={dotsRef}>
          <div className="dot"></div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <header className="header" id='header'>
        <div className="container header-content">
          <div className="logo">
            <img src={logo} alt="VeriTrust logo" className="logo-img" />
            <h1>lenskart</h1>
          </div>
          <div className="nav-placeholder"></div>
          <div className="header-actions">
          </div>
        </div>
      </header>
      {navPortal && createPortal(<NavigationComponent />, navPortal)}
    </>
  );
};

export default Header;