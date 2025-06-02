"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AboutMomentsCarousel from "../Components/aboutmomemt";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import MeetOurTeam from "../Components/team";
import styles from "./about.module.css";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    schools: 0,
    students: 0,
    subjects: 0,
    price: 0,
  });

  const sectionRef = useRef(null);

  // Target values for animation
  const targetValues = {
    schools: 10,
    students: 500,
    subjects: 10,
    price: 9,
  };

  // Subjects data
  const subjects = [
    {
      icon: "bi-mortarboard", // Math
      title: "Transparent Judging",
      description: "Every score follows a clear rubric—no bias, no guesswork.",
    },
    {
      icon: "bi-trophy", // Science
      title: "Flexible comprtition format",
      description:
        "From knockout to round-robin, we adapt structures to fit subject and scale.",
    },
    {
      icon: "bi-clipboard-data", // Debate
      title: "Real-time Leaderboard",
      description:
        "Rankings update live so schools and students can follow progress instantly.",
    },
    {
      icon: "bi-globe", // English
      title: "National-level Recognition",
      description:
        "Top performers earn digital certificates, trophies, and spotlight features across platforms",
    },
    {
      icon: "bi-laptop", // Geography
      title: "School Dashboard access",
      description:
        "Each school gets a personalized portal to manage teams, track scores, and view schedules.",
    },
  ];

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
        schools: Math.floor(targetValues.schools * easedProgress),
        students: Math.floor(targetValues.students * easedProgress),
        subjects: Math.floor(targetValues.subjects * easedProgress),
        price: Math.floor(targetValues.price * easedProgress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        // Ensure final values are exactly the targets
        setCounters(targetValues);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <div>
      <Navbar></Navbar>
      <section className={styles.hero}>
        <div className={styles.textContainer}>
          <h2 className={styles.title}>ABOUT EKEREMGBA TOURNAMENT</h2>
          <p className={styles.description}>
            Fostering academic brilliance and healthy school rivalry through
            structured contests. This competition is organized by Rev. Emmanuel
            and started in 2021 featuring top schools in the Igbo community.
          </p>
        </div>
        <AboutMomentsCarousel></AboutMomentsCarousel>
      </section>

      <section
        ref={sectionRef}
        className="school-legacy-section py-5"
        style={{ backgroundColor: "#FDF3F2" }}
      >
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-7 col-xl-6 mb-5 mb-lg-0">
              <div className="content-wrapper">
                <Image
                  alt="target"
                  width={35}
                  height={35}
                  src="/images/target.svg"
                ></Image>
                <h5 className=" mb-4 mt-2">Our Mission</h5>

                <p className="description mb-4">
                  Ekeremgba is a school-based academic competition focused on
                  Debate, Mathematics, Science, and more. We bring students
                  together to compete, learn, and grow—sharpening minds,
                  building confidence, and rewarding excellence across every
                  subject.
                </p>
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

      <section
        className="subjects-sectionn py-5"
        style={{ backgroundColor: "black" }}
      >
        <div className="container">
          <h2 className="fw-bold mb-2 text-light pb-4">
            What makes us different
          </h2>

          <div className="row gy-4">
            {subjects.map((item, idx) => (
              <div key={idx} className="col-md-4">
                <div
                  className="subject-card p-4 h-100 rounded-4 text-light"
                  style={{
                    backgroundColor: "#1C1A1A",
                    border: "0.5px solid #494848",
                  }}
                >
                  <div className="subject-icon mb-3">
                    <div className="icon-circle d-inline-flex align-items-center justify-content-center">
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                  </div>
                  <h5 className="fw-semibold">{item.title}</h5>
                  <p className="mb-0">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MeetOurTeam></MeetOurTeam>

      <section className="py-5" style={{ backgroundColor: "#fafafa" }}>
        <div className="bannerContainer d-flex flex-column justify-content-center align-items-center text-white text-center">
          <h2 className="fw-bold mb-3">Want to join the next edition?</h2>
          <Link href="/register" className="btn registerBtn">
            Register your School
          </Link>
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
};

export default About;
