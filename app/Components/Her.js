"use client";
import { useEffect } from "react";

const Banner = () => {
  // Your local images from public folder
  const images = [
    "/images/f.jpg", // Replace with your actual image names
    "/images/forr.jpg",
    "/images/f.jpg",
  ];

  useEffect(() => {
    // Initialize Bootstrap carousel with fade effect
    if (typeof window !== "undefined") {
      const carousel = document.querySelector("#heroCarousel");
      if (carousel && window.bootstrap) {
        new window.bootstrap.Carousel(carousel, {
          interval: 4000,
          ride: "carousel",
        });
      }
    }
  }, []);

  return (
    <div className="hero-carousel-container">
      {/* Bootstrap Carousel */}
      <div
        id="heroCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div
                className="carousel-background"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Static Overlay */}
      <div className="hero-overlay"></div>

      {/* Static Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-icon">🔥</span>
          Ekeremgba 5.0 is coming soon
        </div>

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
          <a href="#register" className="btn btn-primary btn-custom-primary">
            Register your School
          </a>
          <a
            href="#fixtures"
            className="btn btn-outline-light btn-custom-secondary"
          >
            View Fixtures
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
