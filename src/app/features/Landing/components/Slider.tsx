import React, { useState, useEffect, useRef } from 'react';

interface SlideImage {
  src: string;
  alt: string;
}

interface SliderProps {
  images?: SlideImage[];
  autoSlide?: boolean;
  slideInterval?: number;
}

export default function Slider({ 
  images, 
  autoSlide = true, 
  slideInterval = 4000 
}: SliderProps) {
  const defaultImages: SlideImage[] = Array.from({ length: 6 }, (_, i) => ({
    src: `/slider/${i + 1}.jpg`,
    alt: `Slide ${i + 1}`,
  }));

  const slides = images && images.length > 0 ? images : defaultImages;
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(true);
  const slideRef = useRef<HTMLDivElement>(null);

  // Auto-slide effect
  useEffect(() => {
    if (autoSlide && slides.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, slideInterval);
      return () => clearInterval(interval);
    }
  }, [autoSlide, slideInterval, slides.length, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  // Handle infinite loop
  useEffect(() => {
    if (currentSlide === extendedSlides.length - 1) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentSlide(1);
      }, 500);
    }
    if (currentSlide === 0) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentSlide(extendedSlides.length - 2);
      }, 500);
    }
  }, [currentSlide, extendedSlides.length]);

  // Re-enable transition
  useEffect(() => {
    if (!transitionEnabled) {
      setTimeout(() => setTransitionEnabled(true), 50);
    }
  }, [transitionEnabled]);

  return (
    <div className="relative w-full my-16 sm:my-20 md:my-24 lg:my-28">
      <div className="relative w-full max-w-2xl lg:max-w-3xl mx-auto aspect-[3/2] px-4 sm:px-6">
        {/* Slider Wrapper */}
        <div
          ref={slideRef}
          className="flex w-full h-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {extendedSlides.map((image, index) => (
            <div key={index} className="flex-shrink-0 flex-grow-0 basis-full h-full">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 md:left-10 bg-white/80 border-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full cursor-pointer text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300 z-10 hover:bg-white/95 hover:scale-110 active:scale-100 flex items-center justify-center"
          aria-label="Slide anterior"
        >
          ‹
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 md:right-10 bg-white/80 border-none w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full cursor-pointer text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300 z-10 hover:bg-white/95 hover:scale-110 active:scale-100 flex items-center justify-center"
          aria-label="Próximo slide"
        >
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index + 1)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-none cursor-pointer transition-all duration-300 ${
                currentSlide === index + 1
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
