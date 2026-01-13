// hooks/useCustomCursor.js
import { useState, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'; // Assuming you have this from your other files

const useCustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // --- Optimization: Reusable Tween ---
  // We store the tween in a ref so we don't create a new
  // one on every single mousemove event.
  const cursorTween = useRef(null);

  // --- Optimization: useGSAP for setup ---
  // Use useGSAP to set up the tween and initial state.
  useGSAP(() => {
    // Create the reusable tween, paused by default
    cursorTween.current = gsap.to(cursorRef.current, {
      x: () => mousePos.current.x - 10,
      y: () => mousePos.current.y - 10,
      duration: 0.1,
      ease: 'power2.out',
      paused: true,
    });

    // Set initial position and opacity
    gsap.set(cursorRef.current, {
      x: mousePos.current.x - 10,
      y: mousePos.current.y - 10,
      opacity: 1, // Start visible
    });
  }, []);

  // --- Memoized Handlers ---
  const updateMousePosition = useCallback((e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    // --- Optimization: Invalidate and Restart ---
    // This re-runs the tween with the new `mousePos` values.
    cursorTween.current?.invalidate().restart();
  }, []); // Empty dep is correct

  const handleMouseEnter = useCallback(() => {
    gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
  }, []);

  const onCursorEnter = useCallback(() => {
    setIsHovering(true);
    gsap.to(cursorRef.current, { scale: 1.2, duration: 0.3, ease: 'back.out(1.7)' });
  }, []);

  const onCursorLeave = useCallback(() => {
    setIsHovering(false);
    gsap.to(cursorRef.current, { scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
  }, []);

  // --- Event & Observer Logic (in a separate effect) ---
  useGSAP(() => {
    // Use passive listener for scroll-linked events
    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const interactiveSelector = 'button, a, [data-cursor-hover], input[type="submit"], [role="button"], .clickable';

    // Function to add listeners to a node or its children
    const addHoverListeners = (rootNode) => {
      // Check if the rootNode itself matches, or query its children
      const elements = rootNode.matches(interactiveSelector)
        ? [rootNode]
        : Array.from(rootNode.querySelectorAll(interactiveSelector));

      elements.forEach(el => {
        el.addEventListener('mouseenter', onCursorEnter);
        el.addEventListener('mouseleave', onCursorLeave);
      });
    };

    // Add to existing elements
    addHoverListeners(document.body);

    // --- Best Practice: MutationObserver ---
    // This finds new interactive elements added to the DOM later.
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // 1 = Element node
              addHoverListeners(node);
            }
          });
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Best Practice: Full Cleanup ---
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      observer.disconnect();

      // Ensure all listeners are removed on unmount
      document.querySelectorAll(interactiveSelector).forEach(el => {
        el.removeEventListener('mouseenter', onCursorEnter);
        el.removeEventListener('mouseleave', onCursorLeave);
      });
    };
  }, [updateMousePosition, handleMouseEnter, handleMouseLeave, onCursorEnter, onCursorLeave]);

  // --- Optimization: Only return what is needed ---
  // `isVisible` state wasn't used by the component, so it's removed.
  return {
    cursorRef,
    isHovering,
    onCursorEnter,
    onCursorLeave
  };
};

export default useCustomCursor;