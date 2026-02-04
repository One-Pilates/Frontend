import '../styles/Slider.scss';
import React, { useState, useEffect, useRef } from 'react';

export default function Slider({ images, autoSlide = true, slideInterval = 4000 }) {
  const defaultImages = Array.from({ length: 6 }, (_, i) => ({
    src: `/slider/${i + 1}.jpg`,
    alt: `Slide ${i + 1}`,
  }));

  const slides = images && images.length > 0 ? images : defaultImages;

  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  const [currentSlide, setCurrentSlide] = useState(1); 
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const slideRef = useRef(null);


  useEffect(() => {
    if (autoSlide && slides.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, slideInterval);
      return () => clearInterval(interval);
    }
  }, [autoSlide, slideInterval, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

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

  useEffect(() => {
    if (!transitionEnabled) {
      setTimeout(() => setTransitionEnabled(true), 50);
    }
  }, [transitionEnabled]);

  return (
    <div className="slider">
      <div className="slider-container">
        <div
          className="slider-wrapper"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
          }}
          ref={slideRef}
        >
          {extendedSlides.map((image, index) => (
            <div key={index} className="slide">
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>

        <button className="slider-btn prev" onClick={prevSlide}>
          &#8249;
        </button>
        <button className="slider-btn next" onClick={nextSlide}>
          &#8250;
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index + 1 ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
