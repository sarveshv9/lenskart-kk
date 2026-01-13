import React, { memo } from "react";

// --- Optimization: Static Constants Outside Component ---
// All static values are defined once when the module loads,
// preventing them from being re-created on every render.
const STYLES = {
  container: {
    position: 'relative',
    isolation: 'isolate', // Creates a new stacking context
    minHeight: '100vh',
    backgroundColor: '#0A0A0A',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // Sits behind content, but inside the 'isolate' container
  },
  contentOnTop: {
    position: 'relative',
    zIndex: 1, // Ensures content is above the background
  },
};

// --- Optimization: Pre-calculate Static Style Values ---
// The gradient string is static, so we calculate it here, once.
// This avoids any computation inside the component.
const GRADIENT_COLORS = ["#0E2A4F", "#0B3A44", "#050607"];
const GRADIENT_STOPS = [0, 45, 85];
const GRADIENT_STOPS_STRING = GRADIENT_STOPS
  .map((stop, index) => `${GRADIENT_COLORS[index]} ${stop}%`)
  .join(", ");

const GRADIENT_VALUE = `radial-gradient(120% 100% at 50% 100%, ${GRADIENT_STOPS_STRING})`;

// --- Optimization: React.memo ---
// Wraps the component to prevent unnecessary re-renders
// if its props (children) have not changed.
const FooterGradient = memo(({ children }) => {
  // --- Optimization: No Hooks Needed ---
  // By applying the gradient directly via `style`, we
  // eliminate the need for `useRef` and `useEffect`.
  // This removes the "flash" of unstyled content on mount
  // and simplifies the component's lifecycle.

  return (
    // --- Optimization: Semantic HTML ---
    // Changed the root `div` to a `<footer>` for better
    // accessibility and SEO, as implied by the component's name.
    <footer style={STYLES.container}>
      {/*
        --- Optimization: Simplified DOM & Direct Styling ---
        The gradient is now applied directly to this `div`.
        The unnecessary nested `gradientElement` `div` has been removed.
        We merge the static background styles with the pre-calculated
        gradient value.
      */}
      <div
        style={{
          ...STYLES.background,
          background: GRADIENT_VALUE,
        }}
        // --- Accessibility ---
        // This is a purely decorative element, hide it from screen readers.
        aria-hidden="true"
      />

      {/* Content is rendered on top */}
      <div style={STYLES.contentOnTop}>
        {children}
      </div>
    </footer>
  );
});

// --- Best Practice: Debugging ---
// Add a displayName for easier debugging in React DevTools.
FooterGradient.displayName = 'FooterGradient';

export default FooterGradient;