import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react'; // Assuming you have this from your other files

gsap.registerPlugin(ScrollTrigger);

/**
 * A hook that applies a scaling effect to an element based on
 * the page's scroll progress.
 *
 * @param {object} options - Configuration for the zoom.
 * @returns {React.RefObject} A ref to be attached to the element to be zoomed.
 */
export const useGSAPScrollZoom = (options = {}) => {
  const {
    maxScale = 1.3,
    minScale = 1.0,
    start = "top top",
    end = "bottom bottom",
    scrub = true,
    transformOrigin = "center center"
  } = options;

  const elementRef = useRef(null);

  // --- Optimization: useGSAP with scope ---
  // This is the cleanest way to write this hook.
  // - `scope: elementRef` targets the element.
  // - All ScrollTriggers/tweens created inside are
  //   auto-reverted on unmount.
  useGSAP(() => {
    // The `onUpdate` logic from the original is perfectly
    // performant and fine.
    const st = ScrollTrigger.create({
      trigger: "body",
      start: start,
      end: end,
      scrub: scrub,
      onUpdate: (self) => {
        // Interpolate between min and max scale
        const scale = gsap.utils.interpolate(minScale, maxScale, self.progress);

        gsap.set(elementRef.current, {
          scale: scale,
          transformOrigin: transformOrigin,
          force3D: true // Good for performance
        });
      },
      // --- Optimization: Set Initial/End States ---
      // This ensures the element is in the correct state
      // when the page loads or on scroll direction changes.
      onEnter: () => gsap.set(elementRef.current, { scale: minScale }),
      onEnterBack: () => gsap.set(elementRef.current, { scale: maxScale }),
      onLeave: () => gsap.set(elementRef.current, { scale: maxScale }),
      onLeaveBack: () => gsap.set(elementRef.current, { scale: minScale }),
    });

    // The useGSAP context will kill `st` on unmount.

  }, { scope: elementRef, dependencies: [maxScale, minScale, start, end, scrub, transformOrigin] });

  return elementRef;
};