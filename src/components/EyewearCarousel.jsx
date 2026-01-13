import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/EyewearCarousel.css';

// ================== IMAGE IMPORTS ==================
import classicAviator from '../assets/classic-aviator.png';
import modernSquare from '../assets/modern-square.png';
import roundVintage from '../assets/round-vintage.png';
import sportsGoggles from '../assets/sports-goggles.png';
import catEye from '../assets/cat-eye.png';
import wayfarer from '../assets/wayfarer.png';

// ================== DATA ==================
const eyewearData = [
  {
    id: 1,
    name: "Classic Aviator",
    type: "Sunglasses",
    image: classicAviator
  },
  {
    id: 2,
    name: "Modern Square Frame",
    type: "Eyeglasses",
    image: modernSquare
  },
  {
    id: 3,
    name: "Round Vintage",
    type: "Eyeglasses",
    image: roundVintage
  },
  {
    id: 4,
    name: "Sports Goggles",
    type: "Sports Eyewear",
    image: sportsGoggles
  },
  {
    id: 5,
    name: "Cat Eye Fashion",
    type: "Sunglasses",
    image: catEye
  },
  {
    id: 6,
    name: "Wayfarer Classic",
    type: "Sunglasses",
    image: wayfarer
  }
];

export default function EyewearCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const autoPlayDuration = 8000;

  // ================== AUTO PLAY ==================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % eyewearData.length);
      setProgress(0);
    }, autoPlayDuration);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // ================== PROGRESS BAR ==================
  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const value = Math.min((elapsed / autoPlayDuration) * 100, 100);
      setProgress(value);

      if (value < 100) requestAnimationFrame(animate);
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [currentIndex]);

  // ================== HANDLERS ==================
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % eyewearData.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + eyewearData.length) % eyewearData.length);
    setProgress(0);
  };

  const handleIndicatorClick = (index) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setProgress(0);
    }
  };

  // ================== VISIBLE ITEMS ==================
  const getVisibleItems = () => {
    const items = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + eyewearData.length) % eyewearData.length;
      items.push({ ...eyewearData[index], position: i });
    }
    return items;
  };

  const currentItem = eyewearData[currentIndex];

  // ================== JSX ==================
  return (
    <div className="carousel-container" id="eyewear-carousel">
      {/* Background blobs */}
      <div className="blob-container">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="carousel-wrapper">
        <h2 className="carousel-title">Our Collection</h2>

        <div className="carousel-track-wrapper">
          <div className="carousel-track">
            {getVisibleItems().map((item) => {
              const isCenter = item.position === 0;
              const isRight = item.position === 1;

              return (
                <div
                  key={item.id}
                  className="carousel-item"
                  style={{
                    transform: `
                      translateX(${item.position * 550}px)
                      translateZ(${isCenter ? 0 : -250}px)
                      scale(${isCenter ? 1.15 : 0.45})
                      rotateY(${item.position * 18}deg)
                    `,
                    opacity: isCenter ? 1 : (isRight ? 0.3 : 0.2),
                    zIndex: isCenter ? 30 : 20,
                    filter: isCenter ? 'blur(0px)' : 'blur(5px)'
                  }}
                >
                  <div className={`carousel-item-inner ${isCenter ? 'float' : ''}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={isCenter ? 'glow' : ''}
                      draggable="false"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handlePrev} className="nav-button nav-button-left">
            <ChevronLeft size={20} color="#93c5fd" />
          </button>

          <button onClick={handleNext} className="nav-button nav-button-right">
            <ChevronRight size={20} color="#93c5fd" />
          </button>
        </div>

        <div className="info-section">
          <span className="type-badge">{currentItem.type}</span>
          <h3 className="item-name">{currentItem.name}</h3>
        </div>

        <div className="indicators">
          {eyewearData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
            >
              {index === currentIndex && (
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}