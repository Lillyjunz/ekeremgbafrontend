"use client";
import { useEffect, useRef, useState } from "react";

const SchoolLegacyStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    schools: 0,
    students: 0,
    subjects: 0,
    price: 0,
  });

  const sectionRef = useRef(null);

  // Target values for animation - moved inside useEffect to avoid dependency issue
  const targetValues = useRef({
    schools: 10,
    students: 500,
    subjects: 10,
    price: 9,
  });

  // Intersection Observer to trigger animation when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate counters when component becomes visible
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCounters({
        schools: Math.floor(targetValues.current.schools * easedProgress),
        students: Math.floor(targetValues.current.students * easedProgress),
        subjects: Math.floor(targetValues.current.subjects * easedProgress),
        price: Math.floor(targetValues.current.price * easedProgress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        // Ensure final values are exactly the targets
        setCounters(targetValues.current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="school-legacy-section py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-lg-7 col-xl-6 mb-5 mb-lg-0">
            <div className="content-wrapper">
              <h2 className="main-title mb-4">
                More Than Just competitions
                <br />
                <span className="highlight-text">We Build School Legacies</span>
              </h2>

              <p className="description mb-4">
                Keremgba is a school-based academic competition focused on
                Debate, Mathematics, Science, and more. We bring students
                together to compete, learn, and grow—sharpening minds, building
                confidence, and rewarding excellence across every subject.
              </p>

              <button className="register-btn">Register your School</button>
            </div>
          </div>

          {/* Right Stats */}
          <div className="col-lg-5 col-xl-6">
            <div className="stats-wrapper">
              <div className="row g-4">
                {/* Schools Participated */}
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-number">{counters.schools}+</div>
                    <div className="stat-label">Schools Participated</div>
                  </div>
                </div>

                {/* Students */}
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-number">{counters.students}+</div>
                    <div className="stat-label">Students</div>
                  </div>
                </div>

                {/* Core Subjects */}
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-number">{counters.subjects}+</div>
                    <div className="stat-label">Core Subjects Covered</div>
                  </div>
                </div>

                {/* Price Won */}
                <div className="col-6">
                  <div className="stat-card">
                    <div className="stat-number">0{counters.price}+</div>
                    <div className="stat-label">Price Won</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolLegacyStats;
