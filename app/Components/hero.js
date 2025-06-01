"use client";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample images - replace with your actual image URLs
  const images = ["/images/f.jpg", "/images/forr.jpg", "/images/f.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="hero-section">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`hero-background ${
            index === currentImageIndex ? "active" : ""
          }`}
          style={{
            backgroundImage: `url(${image})`,
            opacity: index === currentImageIndex ? 1 : 0,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <div className="hero-badge">Ekeremgba 5.0 is coming soon</div>

        <h1 className="hero-title">
          Championing Academic Excellence
          <br />
          Through Competition
        </h1>

        <p className="hero-description">
          Ekeremgba Academic Competition brings schools together in a test of
          <br />
          knowledge, skill, and critical thinking in subjects like Math,
          English,
          <br />
          Science, and Debate
        </p>

        <div className="hero-buttons">
          <a href="#register" className="btn btn-primary-custom">
            Register your School
          </a>
          <a href="#fixtures" className="btn btn-secondary-custom">
            View Fixtures
          </a>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="image-indicators">
        {images.map((_, index) => (
          <div
            key={index}
            className={`indicator ${
              index === currentImageIndex ? "active" : ""
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
