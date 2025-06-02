"use client";
import { useEffect, useState } from "react";

const AboutMomentsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample data - replace with your actual images and content
  const slides = [
    {
      id: 1,
      image: "/images/forr.jpg",
      alt: "Exciting moment 1",
    },
    {
      id: 2,
      image: "/images/day1.jpg",
      alt: "Exciting moment 2",
    },
    {
      id: 3,
      image: "/images/day2.jpg",
      alt: "Exciting moment 3",
    },
    {
      id: 4,
      image: "/images/day3.jpg",
      alt: "Exciting moment 4",
    },
    {
      id: 5,
      image: "/images/day5.jpg",
      alt: "Exciting moment 4",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 1000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="exciting-momentss-section">
      <div className="container">
        <div className="carousel-container position-relative">
          <div
            id="excitingMomentsCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`carousel-item ${
                    index === currentSlide ? "active" : ""
                  }`}
                >
                  <img
                    src={slide.image}
                    className="d-block w-100 carousel-image"
                    alt={slide.alt}
                  />
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              className="carousel-control-prev"
              type="button"
              onClick={prevSlide}
              aria-label="Previous"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={nextSlide}
              aria-label="Next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
            </button>

            {/* Custom pagination dots overlaid on image */}
            <div className="custom-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`indicator-dot ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMomentsCarousel;
