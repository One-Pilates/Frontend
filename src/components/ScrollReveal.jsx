import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  const animations = {
    'fade-up': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    },
    'fade-down': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
    },
    'fade-left': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
    },
    'fade-right': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
    },
    'zoom-in': {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.9)',
    },
    fade: {
      opacity: isVisible ? 1 : 0,
    },
  };

  return (
    <div
      ref={elementRef}
      style={{
        transition: `all ${duration}s ease-out ${delay}s`,
        ...animations[animation],
      }}
    >
      {children}
    </div>
  );
}
