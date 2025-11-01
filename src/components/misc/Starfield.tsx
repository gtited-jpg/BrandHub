'use client';

import { useMemo } from 'react';

export default function Starfield() {
  const allStars = useMemo(() => {
    // Regular twinkling stars
    const numStars = 120;
    const regularStars = Array.from({ length: numStars }).map((_, i) => {
      const size = Math.random() * 2.5 + 1;
      const animation = Math.random() > 0.5 ? 'animate-pulse' : 'animate-twinkle';
      return {
        id: `star-${i}`,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 3}s`,
        },
        className: `absolute bg-white rounded-full shadow-[0_0_8px_white] ${animation}`,
      };
    });

    // Purple shooting stars
    const numShootingStars = 5;
    const shootingStars = Array.from({ length: numShootingStars }).map((_, i) => {
        return {
            id: `shooting-star-${i}`,
            style: {
                top: `${Math.random() * 80}%`,
                left: 0,
                animation: `shoot ${Math.random() * 4 + 4}s ease-in ${Math.random() * 10 + 3}s infinite`,
            },
            className: `absolute h-0.5 w-32 bg-gradient-to-r from-primary to-transparent transform -rotate-45 -translate-x-full`,
        };
    });

    return [...regularStars, ...shootingStars];
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {allStars.map(star => (
        <div key={star.id} style={star.style} className={star.className} />
      ))}
    </div>
  );
}
