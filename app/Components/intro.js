"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SchoolLegacyStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    schools: 0,
    students: 0,
    subjects: 0,
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
    participants: ["", "", "", ""],
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const targetValues = useRef({
    schools: 0,
    students: 0,
    subjects: 0,
  });

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
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Intersection Observer to trigger animation
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
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targetValues.current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, loading]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipantChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((participant, i) =>
        i === index ? value : participant
      ),
    }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      participants: ["", "", "", ""],
    });
    setTermsAccepted(false);
    setModalError("");
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
        (participant) => participant.trim() !== ""
      );

      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        participants: filteredParticipants,
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

      const responseData = await response.json();

      if (response.ok && responseData.status === true) {
        setShowSuccess(true);
        setShowModal(false);
        clearForm();
      } else {
        const errorMessage =
          responseData.message ||
          responseData.error ||
          `Registration failed with status ${response.status}`;
        setModalError(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setModalError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setModalError("Registration failed. Please try again later.");
      }
    } finally {
      setIsLoadingModal(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <section ref={sectionRef} className="school-legacy-section py-5">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Section */}
            <div className="col-lg-7 col-xl-6 mb-5 mb-lg-0">
              <div className="content-wrapper">
                <h2 className="main-title mb-4">
                  More Than Just Competitions
                  <br />
                  <span className="highlight-text">We Build Legacies</span>
                </h2>

                <p className="description mb-4">
                  Ekeremgba Akpauche is more than a competition — it is a
                  movement to revive the Igbo spirit of wisdom (Amamihe),
                  eloquence (Nkwuwa Okwu), and unity (ịdịnotu). We bring
                  together schools, students, and communities to celebrate the
                  richness of Igbo language and culture in joyful, profound and
                  meaningful ways.
                </p>

                <button onClick={openModal} className="register-btn">
                  Register School (2026)
                </button>
              </div>
            </div>

            {/* Right Stats Section */}
            <div className="col-lg-5 col-xl-6">
              <div className="stats-wrapper">
                <div className="row g-4">
                  {/* Schools */}
                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">
                        {loading ? "..." : `${counters.schools}+`}
                      </div>
                      <div className="stat-label">Schools Participated</div>
                    </div>
                  </div>

                  {/* Students */}
                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">
                        {loading ? "..." : `${counters.students}+`}
                      </div>
                      <div className="stat-label">Students</div>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="col-6">
                    <div className="stat-card">
                      <div className="stat-number">
                        {loading ? "..." : `${counters.subjects}+`}
                      </div>
                      <div className="stat-label">Tournaments Hosted</div>
                    </div>
                  </div>

                  {/* Prize */}
                  <div className="col-6">
                    <div className="stat-card">
                      <div className=" d-flex justify-content-center align-items-center">
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
              <div className="alert alert-danger mb-3" role="alert">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="schoolName" className="form-label text-muted">
                  School name*
                </label>
                <input
                  type="text"
                  className="form-control form-input"
                  id="schoolName"
                  name="name"
                  placeholder="Noah Academy"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoadingModal}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label text-muted">
                  Address*
                </label>
                <input
                  type="text"
                  className="form-control form-input"
                  id="address"
                  name="address"
                  placeholder="Enter school address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoadingModal}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label text-muted">
                  Phone number*
                </label>
                <input
                  type="tel"
                  className="form-control form-input"
                  id="phoneNumber"
                  name="phone"
                  placeholder="08012345678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoadingModal}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="emailAddress" className="form-label text-muted">
                  Email address*
                </label>
                <input
                  type="email"
                  className="form-control form-input"
                  id="emailAddress"
                  name="email"
                  placeholder="school@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoadingModal}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted mb-3">
                  Number of Representatives
                </label>
                <div className="representatives-grid">
                  {[1, 2, 3, 4].map((num, index) => (
                    <div key={num} className="rep-input-wrapper">
                      <span className="rep-label">{num}.</span>
                      <input
                        type="text"
                        className="form-control rep-input"
                        placeholder="Full Name"
                        value={formData.participants[index]}
                        onChange={(e) =>
                          handleParticipantChange(index, e.target.value)
                        }
                        disabled={isLoadingModal}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-check mb-4 checkbox-container">
                <input
                  className="form-check-input custom-checkbox"
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
                {isLoadingModal ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Registering...
                  </>
                ) : (
                  "Join the Tournament"
                )}
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
    </>
  );
};

export default SchoolLegacyStats;
