import { useRef, useEffect, useState, useId } from 'react';

const CurvedLoop = ({
  imageSrc = '',
  speed = 2,
  className,
  curveAmount = 400,
  direction = 'left',
  interactive = true,
  imageSize = 40
}) => {
  const pathRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid}`;

  // Center vertically: put the base Y at half of SVG height (e.g. 60 for height=120)
  const svgHeight = 120;
  const centerY = svgHeight / 2;

  // Curve path centered vertically
  const pathD = `M-100,${centerY} Q500,${centerY + curveAmount} 1540,${centerY}`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const imageSpacing = imageSize + 40;
  
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      setOffset(0);
    }
  }, [pathD]);

  useEffect(() => {
    if (!pathLength) return;
    
    let frame = 0;
    const step = () => {
      if (!dragRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        setOffset(current => {
          let newOffset = current + delta;
          if (newOffset > pathLength) newOffset = 0;
          if (newOffset < 0) newOffset = pathLength;
          return newOffset;
        });
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [pathLength, speed]);

  const onPointerDown = e => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    e.preventDefault();
    if (e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = e => {
    if (!interactive || !dragRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;

    setOffset(current => {
      let newOffset = current - dx; // Reverse for natural drag feel
      if (newOffset > pathLength) newOffset = 0;
      if (newOffset < 0) newOffset = pathLength;
      return newOffset;
    });
    e.preventDefault();
  };

  const endDrag = e => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'left' : 'right'; // Reversed
    if (e.target.releasePointerCapture) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  const getPointAtLength = (length) => {
    if (!pathRef.current) return { x: 0, y: 0 };
    const point = pathRef.current.getPointAtLength(length % pathLength);
    return point;
  };

  const getTangentAtLength = (length) => {
    if (!pathRef.current) return 0;
    const point1 = pathRef.current.getPointAtLength(length % pathLength);
    const point2 = pathRef.current.getPointAtLength((length + 1) % pathLength);
    return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
  };

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

  // Calculate number of images needed
  const numImages = Math.ceil(pathLength / imageSpacing) + 1;
  const images = [];

  for (let i = 0; i < numImages; i++) {
    const imageOffset = (offset + i * imageSpacing) % pathLength;
    const point = getPointAtLength(imageOffset);
    const rotation = getTangentAtLength(imageOffset);

    images.push(
      <image
        key={i}
        href={imageSrc}
        width={imageSize}
        height={imageSize}
        x={point.x - imageSize/2}
        y={point.y - imageSize/2}
        transform={`rotate(${rotation} ${point.x} ${point.y})`}
        className={className}
        style={{ pointerEvents: 'none' }}
      />
    );
  }

  return (
    <div
      style={{ 
        width: '100%', 
        height: `${svgHeight}px`, 
        cursor: cursorStyle,
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center', // center the svg vertically if container is taller
        justifyContent: 'center'
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      <svg 
        width="100%" 
        height={svgHeight} 
        viewBox={`0 0 1440 ${svgHeight}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <path 
            ref={pathRef}
            id={pathId} 
            d={pathD} 
            fill="none" 
            stroke="transparent" 
          />
        <linearGradient id={`fade-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id={`mask-${uid}`}>
            <rect x="0" y="0" width="1440" height="250" fill={`url(#fade-${uid})`} />
          </mask>
        </defs>
               <g mask={`url(#mask-${uid})`}>
          {pathLength > 0 && imageSrc && images}
        </g>
      </svg>
    </div>
  );
};

export default CurvedLoop;