import React, { memo } from 'react';
import useCustomCursor from '../../hooks/useCustomCursor';

// --- Optimization: Constants Outside Render ---
// All static style objects and strings are defined once,
// outside the component, preventing re-creation on every render.
// This saves memory and reduces the cost of each render.

// Styles for the main container that is moved by the hook
const CONTAINER_STYLES = {
  position: 'fixed',
  left: 0,
  top: 0,
  pointerEvents: 'none',
  zIndex: 9999,
  transformOrigin: 'center center',
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
  mixBlendMode: 'difference',
};

// Base styles for the "dot" state
const CIRCLE_STYLES = {
  width: '20px',
  height: '20px',
  border: '3px solid #ffffff',
  backgroundColor: 'transparent',
  borderRadius: '50%',
  mixBlendMode: 'difference',
  transition: 'opacity 0.2s ease-out',
  // Position children to stack inside the container
  position: 'absolute',
  top: '-10px', // Offset to center the 20x20 element
  left: '-10px', // at the hook's 0,0 cursor position
};

// Base styles for the "arrow" state
const ARROW_STYLES = {
  width: '20px',
  height: '20px',
  mixBlendMode: 'difference',
  transition: 'opacity 0.2s ease-out',
  position: 'absolute',
  top: '-10px', // Offset to center
  left: '-10px', // Offset to center
};

// The CSS string to hide the default cursor
const INTERNAL_STYLES = `
  @media (hover: hover) and (pointer: fine) {
    * {
      cursor: none !important;
    }
    input[type="text"],
    input[type="email"],
    input[type="password"],
    textarea {
      cursor: text !important;
    }
  }
  @media (hover: none) and (pointer: coarse) {
    * {
      cursor: auto !important;
    }
  }
`;

// --- Optimization: Memoized Component ---
// Wrapped in React.memo to prevent re-renders from parent components.
// It will still re-render when `isHovering` changes from its *own* hook.
const CustomCursor = memo(() => {
  const { cursorRef, isHovering } = useCustomCursor();

  return (
    <>
      {/* This <style> tag is rendered once and its content is
          a static constant, making it very cheap. */}
      <style>{INTERNAL_STYLES}</style>

      {/* --- Optimization: Accessibility --- */}
      {/* This is a purely decorative element and should be
          hidden from the accessibility tree. */}
      <div ref={cursorRef} style={CONTAINER_STYLES} aria-hidden="true">
        {/*
          --- Optimization: Render Both, Toggle Opacity ---
          Instead of conditionally mounting/unmounting the SVG and DIV
          (which causes DOM mutations), we render both and simply
          toggle their opacity. This is far more performant.
        */}
        <div
          style={{
            ...CIRCLE_STYLES,
            opacity: isHovering ? 0 : 1,
          }}
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            ...ARROW_STYLES,
            opacity: isHovering ? 1 : 0,
          }}
        >
          <path
            d="M17.2607 12.4008C19.3774 11.2626 20.4357 10.6935 20.7035 10.0084C20.9359 9.41393 20.8705 8.74423 20.5276 8.20587C20.1324 7.58551 18.984 7.23176 16.6872 6.52425L8.00612 3.85014C6.06819 3.25318 5.09923 2.95471 4.45846 3.19669C3.90068 3.40733 3.46597 3.85584 3.27285 4.41993C3.051 5.06794 3.3796 6.02711 4.03681 7.94545L6.94793 16.4429C7.75632 18.8025 8.16052 19.9824 8.80519 20.3574C9.36428 20.6826 10.0461 20.7174 10.6354 20.4507C11.3149 20.1432 11.837 19.0106 12.8813 16.7454L13.6528 15.0719C13.819 14.7113 13.9021 14.531 14.0159 14.3736C14.1168 14.2338 14.2354 14.1078 14.3686 13.9984C14.5188 13.8752 14.6936 13.7812 15.0433 13.5932L17.2607 12.4008Z"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
});

// --- Best Practice: Debugging ---
// Add a displayName for easier debugging in React DevTools.
CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;