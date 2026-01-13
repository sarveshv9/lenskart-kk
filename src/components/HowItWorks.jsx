import React, { useEffect, useRef, useMemo, memo } from 'react';
// No new imports added, as requested.
import '../styles/HowItWorks.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// --- Best Practice: GSAP Plugin Registration ---
// Plugins are registered once, globally, at the top level.
gsap.registerPlugin(ScrollTrigger);

// --- Optimization: Data Outside Component ---
// The steps data is static and defined outside the component.
// This prevents the array from being recreated on every render.
const steps = [
  {
    icon: '🪪',
    title: 'Own Your Digital Identity',
    description:
      'Start by connecting your Web3 wallet - your decentralized ID in the VeriTrust ecosystem. No more rented profiles. Your reputation, skills, and data truly belong to you — forever stored and verified on Ethereum.',
  },
  {
    icon: '⚡️',
    title: 'Submit Reviews — The Fair Way',
    description:
      'Every feedback goes through a small Proof-of-Work (PoW) challenge before its accepted. This keeps bots and spam out, ensuring that every review added to the chain is genuine and earned.',
  },
  {
    icon: '🤖',
    title: 'Let AI Verify Every Word',
    description:
      'Our AI engine runs deep sentiment analysis and fraud detection on every review. It cross-checks tone, context, and authenticity before locking it immutably on the blockchain.',
  },
  {
    icon: '🌐',
    title: 'Showcase Your Reputation Anywhere',
    description:
      'Once verified, your professional reputation becomes a shareable asset. Generate immutable links or APIs to embed your trust score across portfolios, marketplaces, and DApps — decentralized, portable, and 100% yours.',
  },
];

// --- Optimization: Helper Outside Component ---
// This pure function is correctly defined outside the render cycle.
const splitTextIntoWords = (text) => {
  return text.split(' ').map((word, index) => (
    <span
      key={index}
      className="word-span"
      style={{
        display: 'inline-block',
        marginRight: '0.25em',
      }}
    >
      {word}
    </span>
  ));
};

// --- Optimization: React.memo ---
// The entire component is wrapped in `React.memo`. Since it takes
// no props, this ensures it *never* re-renders after its initial
// mount, even if its parent component updates.
const HowItWorks = memo(() => {
  const containerRef = useRef(null);
  const h2Ref = useRef(null);

  // --- Best Practice: useGSAP (via useEffect) ---
  // The provided code's useEffect is already a perfect implementation
  // of what `useGSAP` with a `gsap.context()` does.
  useEffect(() => {
    // --- Best Practice: GSAP Context ---
    // All animations and ScrollTriggers are created within this
    // context, allowing for perfect cleanup with `context.revert()`.
    let context = gsap.context(() => {
      // Use a robust selector for smooth scrolling containers
      const scroller =
        document.querySelector('.smooth-wrapper') || window;

      // Selectors are automatically scoped to `containerRef`
      const pinnedText = '.pinned-text';
      const stepContainers = gsap.utils.toArray('.step-container');
      const descriptionWords = gsap.utils.toArray(
        '.step-description .word-span'
      );
      const stepIcons = gsap.utils.toArray('.step-icon');
      const blobs = gsap.utils.toArray('.blob');
      const mainContainer = containerRef.current;

      // --- Blob Animation Logic ---
      const blobContainer = document.querySelector('.blob-container');
      gsap.set(blobContainer, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        zIndex: 0,
      });
      gsap.set(blobs, { opacity: 0.8, force3D: true });

      let lastScroll = 0;
      ScrollTrigger.create({
        trigger: mainContainer,
        scroller: scroller,
        start: 'center bottom',
        end: 'bottom top',
        scrub: 1.2,
        id: 'blob-scroll',
        onUpdate: (self) => {
          const scrollDelta = self.scroll() - lastScroll;
          lastScroll = self.scroll();
          blobs.forEach((blob) => {
            gsap.to(blob, {
              y: `+=${scrollDelta * 0.2}`,
              duration: 0.8,
              ease: 'power1.out',
              overwrite: 'auto',
              force3D: true,
            });
          });
        },
      });

      blobs.forEach((blob) => {
        gsap.set(blob, {
          xPercent: gsap.utils.random(-150, -50),
          yPercent: gsap.utils.random(-30, 30),
          scale: gsap.utils.random(0.8, 1.2),
        });
        gsap.to(blob, {
          xPercent: '+=300',
          duration: gsap.utils.random(12, 20),
          ease: 'none',
          repeat: -1,
          modifiers: { xPercent: (x) => parseFloat(x) % 300 },
        });
        gsap.to(blob, {
          yPercent: '+=20',
          duration: gsap.utils.random(4, 6),
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      });

      ScrollTrigger.create({
        trigger: mainContainer,
        scroller: scroller,
        start: 'top+=200 top',
        end: 'bottom bottom+=800',
        pin: '.blob-container',
        pinSpacing: false,
        id: 'blob-pin',
      });
      // --- End Blob Logic ---

      // Set initial state for pinned text
      gsap.set(pinnedText, {
        scale: 0.5,
        opacity: 0,
        force3D: true,
      });

      // Main Title Animation (imperative DOM manipulation is fine here)
      const mainTitle = h2Ref.current;
      if (mainTitle) {
        const titleText = mainTitle.textContent;
        const titleWords = titleText
          .split(' ')
          .map(
            (word) =>
              `<span class="title-word" style="display: inline-block; margin-right: 0.25em;">${word}</span>`
          )
          .join('');
        mainTitle.innerHTML = titleWords;
        const newTitleWords = mainTitle.querySelectorAll('.title-word');

        gsap.set(newTitleWords, {
          y: 30,
          opacity: 0,
          rotationX: 45,
          force3D: true,
        });
        gsap.to(newTitleWords, {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.3,
          stagger: 0.1,
          force3D: true,
        });
      }

      // Set initial states for all step elements
      gsap.set(descriptionWords, { y: 15, opacity: 0, force3D: true });
      gsap.set(stepIcons, {
        scale: 0.8,
        rotation: -90,
        opacity: 0,
        force3D: true,
      });

      // Animate pinned text
      ScrollTrigger.create({
        trigger: '.pin-container',
        scroller: scroller,
        start: 'top 80%',
        end: 'center center',
        scrub: 0.5,
        animation: gsap.to(pinnedText, {
          scale: 1.2,
          opacity: 1,
          ease: 'none',
          force3D: true,
        }),
        id: 'title-scale',
        invalidateOnRefresh: true,
      });

      ScrollTrigger.create({
        trigger: '.pin-container',
        scroller: scroller,
        start: 'center center',
        end: 'center center',
        scrub: 0.3,
        pin: '.pin-container',
        pinSpacing: false,
        anticipatePin: 1,
        id: 'pinned-text',
        invalidateOnRefresh: true,
      });

      // Main Step Animations
      stepContainers.forEach((step, index) => {
        const isLast = index === stepContainers.length - 1;
        const stepDescriptionWords = step.querySelectorAll(
          '.step-description .word-span'
        );
        const stepTitle = step.querySelector('.step-title');
        const stepIcon = step.querySelector('.step-icon');
        const stepNumber = step.querySelector('.step-number');

        gsap.set(stepTitle, { y: 15, opacity: 0, force3D: true });

        const stepTimeline = gsap.timeline();
        stepTimeline
          .to(step, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0)
          .to(
            stepIcon,
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.2)',
            },
            '-=0.2'
          )
          .to(stepTitle, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
          .to(
            stepDescriptionWords,
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.015 },
            '-=0.3'
          )
          .to({}, { duration: 0.5 }) // Hold
          .to(stepTitle, { opacity: 0, duration: 0.6 })
          .to(
            stepDescriptionWords,
            { opacity: 0, duration: 0.6, stagger: 0.008 },
            '-=0.5'
          )
          .to([stepIcon, stepNumber], { opacity: 0, duration: 0.6 }, '-=0.5')
          .to(step, { autoAlpha: 0, duration: 0.5 }, '-=0.4');

        ScrollTrigger.create({
          trigger: step,
          scroller: scroller,
          start: 'center center',
          end: isLast ? 'center+=1200 center' : 'center+=1100 center',
          scrub: 0.8,
          pin: true,
          pinSpacing: false,
          animation: stepTimeline,
          id: `step-${index + 1}`,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          // `force3D: true` is already set on tweens, but this reinforces it
          onStart: () => gsap.set(step, { position: 'relative', display: 'flex' }),
        });
      });

      ScrollTrigger.refresh();
    }, containerRef); // Scope the context to our main container!

    // --- Best Practice: Cleanup Function ---
    // This reverts all animations and ScrollTriggers created
    // inside the context, preventing memory leaks on unmount.
    return () => context.revert();
  }, []); // Empty dependency array ensures this runs only once.

  return (
    // --- Optimization: Semantics ---
    // `aria-labelledby` points to the main heading for better
    // screen reader navigation.
    <section
      className="how-it-works"
      id="how-it-works"
      ref={containerRef}
      aria-labelledby="how-it-works-title"
    >
      {/* --- Optimization: Accessibility --- */}
      {/* Decorative elements are hidden from screen readers. */}
      <div className="blob-container" aria-hidden="true">
        <div className="blob one"></div>
        <div className="blob two"></div>
      </div>

      <div className="pin-container">
        <div
          className="pinned-text"
          ref={h2Ref}
          id="how-it-works-title"
        >
          How VeriTrust Works
        </div>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <Step
            key={step.title} // Use a unique string like title
            icon={step.icon}
            title={step.title}
            description={step.description}
            index={index}
          />
        ))}
      </div>
      <div className="section-spacer"></div>
    </section>
  );
});

// --- Optimization: Memoized Sub-component ---
// We create a new `Step` component. This allows us to use
// `useMemo` for the `splitTextIntoWords` call, ensuring it
// *only* runs once per step, not during the parent's mapping.
const Step = memo(({ icon, title, description, index }) => {
  // --- Optimization: useMemo ---
  // This memoizes the result of `splitTextIntoWords`.
  // The word-spans are created only once for this step
  // and are reused on any (unlikely) re-renders.
  const descriptionWords = useMemo(
    () => splitTextIntoWords(description),
    [description]
  );

  return (
    <div className="step-container" data-step={index + 1}>
      <div className="step-content">
        <div className="step-left">
          {/* --- Optimization: Accessibility --- */}
          {/* Decorative icons are hidden from screen readers. */}
          <div className="step-icon" aria-hidden="true">
            {icon}
          </div>
          <h3 className="step-title">{title}</h3>
        </div>
        <div className="step-right">
          <div className="step-description">{descriptionWords}</div>
        </div>
      </div>
      <div className="step-number" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
});

// --- Best Practice: Debugging ---
// Add display names for easier debugging in React DevTools.
HowItWorks.displayName = 'HowItWorks';
Step.displayName = 'Step';

export default HowItWorks;