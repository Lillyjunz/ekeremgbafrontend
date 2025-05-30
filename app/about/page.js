"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import MeetOurTeam from "../Components/team";
import Topbar from "../Components/topbar";
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
      icon: "🧮",
      title: "Mathematics",
      description:
        "Problem-solving, calculations, and mathematical reasoning across various topics and difficulty levels.",
    },
    {
      icon: "🔬",
      title: "Science",
      description:
        "Exploring physics, chemistry, biology, and general science concepts through practical applications.",
    },
    {
      icon: "🗣️",
      title: "Debate",
      description:
        "Developing critical thinking, public speaking, and argumentation skills through structured debates.",
    },
    {
      icon: "📚",
      title: "English Language",
      description:
        "Grammar, comprehension, vocabulary, and communication skills in the English language.",
    },
    {
      icon: "🌍",
      title: "Geography",
      description:
        "Understanding world geography, physical features, climate, and cultural diversity.",
    },
    {
      icon: "⏳",
      title: "History",
      description:
        "Exploring historical events, civilizations, and their impact on modern society.",
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
      <Topbar></Topbar>
      <Navbar></Navbar>
      <section className={styles.hero}>
        <div className={`${styles.circle} ${styles.circle1}`}></div>
        <div className={`${styles.circle} ${styles.circle2}`}></div>
        <div className={`${styles.circle} ${styles.circle3}`}></div>

        <div className={styles.textContainer}>
          <h2 className={styles.title}>ABOUT EKEREMGBA</h2>
          <p className={styles.description}>
            Everything about the Ekeremgba competition you need to know about
          </p>
        </div>
      </section>

      <section ref={sectionRef} className="school-legacy-section py-5">
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

      <section className="subjects-section container py-5">
        <h2 className="fw-bold mb-2">Subjects & Events</h2>
        <p className="text-muted mb-4">
          The competition will feature the following
        </p>
        <div className="row gy-4">
          {subjects.map((item, idx) => (
            <div key={idx} className="col-md-4">
              <div className="subject-card p-4 h-100 rounded-4 bg-light">
                <div className="subject-icon mb-3 fs-2">{item.icon}</div>
                <h5 className="fw-semibold">{item.title}</h5>
                <p className="mb-0">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MeetOurTeam></MeetOurTeam>

      <div className={`container my-5 ${styles.joinSection}`}>
        <div className={`position-relative rounded-4 overflow-hidden`}>
          {/* Blurred background image */}
          <div className={styles.blurBackground}></div>

          {/* Foreground content */}
          <div
            className={`position-relative text-center text-white p-5 ${styles.content}`}
          >
            <h2 className="fw-bold mb-4">Want to Join the Next Edition?</h2>
            <button className="btn btn-danger px-4 py-2 rounded-pill">
              Register your School
            </button>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default About;
