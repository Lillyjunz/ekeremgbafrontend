"use client";

import Image from "next/image";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    participants: ["", "", ""], // reduced to 3
    schoolReps: ["", ""], // added 2 coordinators
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const targetValues = useRef({
    schools: 0,
    students: 0,
    subjects: 0,
    price: 0,
  });

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [studentsRes, schoolsRes, tournamentsRes] = await Promise.all([
          fetch(
            "https://api.ekeremgbaakpauche.com/api/school/get-all-students"
          ),
          fetch("https://api.ekeremgbaakpauche.com/api/school/get-schools"),
          fetch("https://api.ekeremgbaakpauche.com/api/admin/tournaments"),
        ]);

        if (!studentsRes.ok || !schoolsRes.ok || !tournamentsRes.ok) {
          throw new Error("One or more API requests failed");
        }

        const studentsData = await studentsRes.json();
        const schoolsData = await schoolsRes.json();
        const tournamentsData = await tournamentsRes.json();

        targetValues.current.students =
          typeof studentsData?.schools?.number_of_students === "number"
            ? studentsData.schools.number_of_students
            : 0;

        targetValues.current.schools = Array.isArray(
          schoolsData?.schools?.allSchools
        )
          ? schoolsData.schools.allSchools.length
          : 0;

        targetValues.current.subjects = Array.isArray(tournamentsData)
          ? tournamentsData.length
          : 0;

        targetValues.current.price = 300000; // Example value
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Intersection Observer for counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate counters
  useEffect(() => {
    if (!isVisible || loading) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCounters({
        schools: Math.floor(targetValues.current.schools * easedProgress),
        students: Math.floor(targetValues.current.students * easedProgress),
        subjects: Math.floor(targetValues.current.subjects * easedProgress),
        price: Math.floor(targetValues.current.price * easedProgress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targetValues.current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, loading]);

  const subjects = [
    {
      icon: "bi-mortarboard",
      title: "A battle of the mind",
      description:
        "This programme celebrates an intellectual wrestling that sharpens reasoning and strengthens the intellect. Participants are challenged to think reason and express themselves in the Igbo language, using it as a tool for creativity problem-solving and deep reflection on human values and community life.",
    },
    {
      icon: "bi-trophy",
      title: "The Power of Language",
      description:
        "Language is not only a means of communication. It is also a medium for thinking, research, governance, art, and craftsmanship. A people who use their language in science, creativity, and technology build stronger societies and better education systems. Thus, Ekeremgba Akpauche encourages our youth to dream, research, and create — in their own tongue.",
    },
    {
      icon: "bi-clipboard-data",
      title: "Purpose and Vision",
      description:
        "The goal of Ekeremgba Akpauche is to rebuild and revitalize the Igbo language and culture, restoring pride and fluency among young people. But it does not stop there — it seeks to prove that the Igbo language has direction, purpose, and a future.",
    },
    {
      icon: "bi-globe",
      title: "A call to ndi-igbo",
      description:
        "Fellow Igbo sons and daughters, it is time to wake up from slumber. This movement reminds us — especially our children — of the importance of speaking, studying, and thinking in Igbo, particularly in education and research. Using our language to explore deep ideas gives us the power to build and renew our communities.",
    },
  ];

  // Modal functions
  const openModal = () => {
    setShowModal(true);
    setModalError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setModalError("");
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      participants: ["", "", ""],
      schoolReps: ["", ""],
    });
    setTermsAccepted(false);
    setModalError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p, i) => (i === index ? value : p)),
    }));
  };

  const handleSchoolRepChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      schoolReps: prev.schoolReps.map((rep, i) => (i === index ? value : rep)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!termsAccepted) {
      setModalError("Please accept the terms and conditions");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      setModalError("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setModalError("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setModalError("Please enter a valid phone number");
      return;
    }

    setIsLoadingModal(true);

    try {
      const filteredParticipants = formData.participants.filter(
        (p) => p.trim() !== ""
      );
      const filteredSchoolReps = formData.schoolReps.filter(
        (rep) => rep.trim() !== ""
      );

      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        participants: filteredParticipants,
        schoolReps: filteredSchoolReps,
      };

      const response = await fetch(
        "https://api.ekeremgbaakpauche.com/api/school/register-school",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === true) {
        setShowSuccess(true);
        setShowModal(false);
        clearForm();
      } else {
        setModalError(data.message || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setModalError("Network error. Please try again later.");
    } finally {
      setIsLoadingModal(false);
    }
  };

  const handleSuccessClose = () => setShowSuccess(false);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.textContainer}>
          <h2 className={styles.title}>ABOUT EKEREMGBA TOURNAMENT</h2>
          <p className={styles.description}>
            Promoting pride in our heritage through education, creativity, and
            friendly competition among secondary schools in Nigeria.
          </p>
        </div>
        <AboutMomentsCarousel />
      </section>

      {/* Stats Section */}
      <section
        ref={sectionRef}
        className="school-legacy-section py-5"
        style={{ backgroundColor: "#FDF3F2" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-xl-6 mb-5 mb-lg-0">
              <div className="content-wrapper">
                <Image
                  alt="target"
                  width={35}
                  height={35}
                  src="/images/target.svg"
                />
                <h5 className="mb-3 mt-2">Our Mission</h5>
                <p className="description mb-4">
                  We create intellectual, educational, cultural, and linguistic
                  experiences that connect young people to their heritage,
                  promote excellence, and inspire social-cultural development.
                </p>

                <h5 className="mb-3 mt-2">Our Vision</h5>
                <p className="description mb-4">
                  To nurture a new generation of proud, confident, and
                  culturally grounded Igbo youth — fluent in their language,
                  expressive in their identity, and respectful of their roots.
                </p>
              </div>
            </div>

            <div className="col-lg-5 col-xl-6">
              <div className="stats-wrapper">
                <div className="row g-4">
                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">
                        {loading ? "..." : `${counters.schools}+`}
                      </div>
                      <div className="stat-label">Schools Participated</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">
                        {loading ? "..." : `${counters.students}+`}
                      </div>
                      <div className="stat-label">Students</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">
                        {loading ? "..." : `${counters.subjects}+`}
                      </div>
                      <div className="stat-label">Tournaments Hosted</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="stat-card">
                      <div className="d-flex justify-content-center align-items-center">
                        <Image
                          className="cash-image"
                          src="/images/naira.png"
                          alt="Cash"
                          width={124}
                          height={124}
                        />
                      </div>
                      <div className="stat-label">Price Won</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section
        className="school-legacy-section py-5"
        style={{ backgroundColor: "#FFF" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div>
              <div className="content-wrapper">
                <h3 className="mb-2 mt-2 fw-semi-bold">
                  The Story of Ekeremgba Akpauche
                </h3>
                <p className="description mb-4">
                  Born out of a desire to encourage the use of Igbo language in
                  learning and research, Ekeremgba Akpauche began as a
                  school-based cultural and language competition. It quickly
                  grew into a regional platform that inspires creativity,
                  teamwork, and a deep sense of belonging among young Igbo
                  learners.
                </p>
              </div>
            </div>

            <div className="content-wrapper">
              <h3 className="mb-3 mt-2 fw-semi-bold">Meaning of the name</h3>
              <p className="description mb-4">
                Ekeremgba Akpauche is a creative initiative designed to promote
                the Igbo language, wisdom, culture, and identity — the essential
                treasures that define who we are as a people. The name itself
                carries deep meaning. In ancient Igbo expression, “Ekeremgba”
                referred to a contest of strength and endurance, while
                “Akpauche” signifies deep thought, reflection, and valuable
                wisdom. Together, Ekeremgba Akpauche represents a contest not of
                muscles, but of the mind — a wrestling of intellect,
                understanding, and wisdom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      <MeetOurTeam />

      {/* Banner + Register Button */}
      <section className="py-5" style={{ backgroundColor: "#fafafa" }}>
        <div className="bannerContainer d-flex flex-column justify-content-center align-items-center text-center">
          <h2 className="fw-bold mb-3 text-light">
            Want to join the next edition?
          </h2>
          <button onClick={openModal} className="btn registerBtn">
            Register School (2026)
          </button>
        </div>
      </section>

      <Footer />

      {/* Registration Modal */}
      {showModal && (
        <div
          className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          onClick={closeModal}
        >
          <div
            className="modal-content bg-white rounded-4 p-4 position-relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="close-button-modal position-absolute"
              aria-label="Close"
              disabled={isLoadingModal}
            >
              ×
            </button>

            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2" style={{ color: "#333" }}>
                Register your School
              </h2>
              <p className="text-muted mb-0">
                Kindly fill this form to reach out to a Consultant
              </p>
            </div>

            {modalError && (
              <div className="alert alert-danger mb-3">{modalError}</div>
            )}

            <form onSubmit={handleSubmit}>
              {["name", "address", "phone", "email"].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label text-muted">
                    {field.charAt(0).toUpperCase() + field.slice(1)}*
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    className="form-control"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    disabled={isLoadingModal}
                    required
                  />
                </div>
              ))}

              {/* Participants */}
              <div className="mb-4">
                <label className="form-label text-muted mb-3 fw-bold">
                  Participants
                </label>
                <div className="representatives-grid">
                  {formData.participants.map((p, idx) => (
                    <div
                      key={idx}
                      className="rep-input-wrapper mb-2 d-flex align-items-center gap-2"
                    >
                      <span className="rep-label">{idx + 1}.</span>
                      <input
                        type="text"
                        className="form-control rep-input"
                        placeholder="Full Name"
                        value={p}
                        onChange={(e) =>
                          handleParticipantChange(idx, e.target.value)
                        }
                        disabled={isLoadingModal}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* School Coordinators */}
              <div className="mb-4">
                <label className="form-label text-muted mb-3 fw-bold">
                  School Coordinators
                </label>
                <div className="representatives-grid">
                  {formData.schoolReps.map((rep, idx) => (
                    <div
                      key={idx}
                      className="rep-input-wrapper mb-2 d-flex align-items-center gap-2"
                    >
                      <span className="rep-label">{idx + 1}.</span>
                      <input
                        type="text"
                        className="form-control rep-input"
                        placeholder="Full Name"
                        value={rep}
                        onChange={(e) =>
                          handleSchoolRepChange(idx, e.target.value)
                        }
                        disabled={isLoadingModal}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div
                className="mb-3 p-3 border rounded"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <p className="text-muted small mb-0">
                  <strong>Terms and Conditions:</strong> By completing the
                  registration form, the school and it&apos;s students agree to
                  abide by all rules and guidelines set forth by the organisers.
                  Incomplete or inaccurate registration details may lead to
                  disqualification.
                </p>
              </div>

              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="termsConditions"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={isLoadingModal}
                  required
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="termsConditions"
                >
                  Accept our Terms and Conditions
                </label>
              </div>

              <button
                type="submit"
                className="btn w-100 text-white fw-bold py-3 submit-button"
                disabled={isLoadingModal}
              >
                {isLoadingModal ? "Registering..." : "Join the Tournament"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
          <div className="modal-content bg-white rounded-4 p-4 text-center position-relative">
            <div className="mb-3">
              <div className="text-success" style={{ fontSize: "3rem" }}>
                ✓
              </div>
            </div>
            <h4 className="text-success mb-3">Registration Successful!</h4>
            <p className="text-muted mb-4">
              Your school has been registered successfully. A consultant will
              reach out to you soon.
            </p>
            <button className="btn btn-success" onClick={handleSuccessClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
