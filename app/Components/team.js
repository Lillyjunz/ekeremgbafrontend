"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const MeetOurTeam = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Team members data - replace with your actual team data
  const teamMembers = [
    {
      id: 1,
      name: "Rev. Emmanuel Opara",
      role: "Organizer",
      image: "/images/for.jpg",
      bio: "Leading the Ekeremgba competition with dedication and vision.",
    },
    {
      id: 2,
      name: "Rev. Emmanuel Opara",
      role: "Organizer",
      image: "/images/forr.jpg",
      bio: "Passionate about educational excellence and student development.",
    },
    {
      id: 3,
      name: "Rev. Emmanuel Opara",
      role: "Organizer",
      image: "/images/for.jpg",
      bio: "Committed to fostering academic competition and growth.",
    },
    {
      id: 4,
      name: "Rev. Emmanuel Opara",
      role: "Organizer",
      image: "/images/forr.jpg",
      bio: "Dedicated to creating opportunities for student excellence.",
    },
    {
      id: 5,
      name: "Dr. Sarah Johnson",
      role: "Academic Director",
      image: "/images/for.jpg",
      bio: "Overseeing curriculum development and academic standards.",
    },
    {
      id: 6,
      name: "Prof. Michael Chen",
      role: "Mathematics Coordinator",
      image: "/images/forr.jpg",
      bio: "Expert in mathematical education and competition preparation.",
    },
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-slide for mobile
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isMobile, teamMembers.length]);

  const itemsPerSlide = isMobile ? 1 : 4;
  const totalSlides = Math.ceil(teamMembers.length / itemsPerSlide);

  const nextSlide = () => {
    if (isMobile) {
      setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
    } else {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (isMobile) {
      setCurrentSlide(
        (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
      );
    } else {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const getCurrentMembers = () => {
    if (isMobile) {
      return [teamMembers[currentSlide]];
    }
    const startIndex = currentSlide * itemsPerSlide;
    return teamMembers.slice(startIndex, startIndex + itemsPerSlide);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="meet-our-team-section">
      <div className="container">
        {/* Header */}
        <div className="team-header mb-5">
          <h2 className="team-title">Meet Our Team</h2>
          <p className="team-subtitle">
            Ekeremgba competitor organizers, they make the tournament possible
          </p>
        </div>

        {/* Team Cards */}
        <div className="team-carousel-wrapper position-relative">
          <div className={`team-slider ${isMobile ? "mobile-slider" : ""}`}>
            <div
              className="team-slides-container"
              style={{
                transform: isMobile
                  ? `translateX(-${currentSlide * 100}%)`
                  : "none",
                display: isMobile ? "flex" : "block",
              }}
            >
              {isMobile ? (
                // Mobile: Show all cards in a sliding container
                teamMembers.map((member, index) => (
                  <div key={member.id} className="team-slide">
                    <div className="team-card">
                      <div className="team-image-wrapper">
                        <div className="team-image-placeholder">
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={200}
                            height={200}
                            className="team-image"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                      <div className="team-info">
                        <h5 className="team-member-name">{member.name}</h5>
                        <p className="team-member-role">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Desktop: Show current set of cards
                <div className="row g-4">
                  {getCurrentMembers().map((member) => (
                    <div key={member.id} className="col-lg-3 col-md-6">
                      <div className="team-card">
                        <div className="team-image-wrapper">
                          <div className="team-image-placeholder">
                            <Image
                              src={member.image}
                              alt={member.name}
                              width={200}
                              height={200}
                              className="team-image"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        </div>
                        <div className="team-info">
                          <h5 className="team-member-name">{member.name}</h5>
                          <p className="team-member-role">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Arrows - Hidden on mobile */}
          {!isMobile && totalSlides > 1 && (
            <>
              <button
                className="team-nav-btn team-nav-prev"
                onClick={prevSlide}
                aria-label="Previous team members"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="team-nav-btn team-nav-next"
                onClick={nextSlide}
                aria-label="Next team members"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Slide Indicators */}
        <div className="team-indicators">
          {isMobile
            ? // Mobile: Show dot for each team member
              teamMembers.map((_, index) => (
                <button
                  key={index}
                  className={`team-indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to team member ${index + 1}`}
                />
              ))
            : // Desktop: Show dot for each slide group
              totalSlides > 1 &&
              Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`team-indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurTeam;
