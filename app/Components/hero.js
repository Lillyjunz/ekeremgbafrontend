"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    participants: ["", "", ""],
    schoolReps: ["", ""],
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const images = ["/images/day5.jpg", "/images/day3.jpg", "/images/day2.jpg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const openModal = () => {
    setShowModal(true);
    setError("");
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
    clearForm();
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
    setError("");
  };

  // ✅ Capitalize each word
  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Capitalize all names before sending
      const filteredParticipants = formData.participants
        .filter((p) => p.trim() !== "")
        .map(capitalizeWords);

      const filteredSchoolReps = formData.schoolReps
        .filter((rep) => rep.trim() !== "")
        .map(capitalizeWords);

      const requestBody = {
        name: capitalizeWords(formData.name),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: capitalizeWords(formData.address),
        participants: filteredParticipants,
        schoolReps: filteredSchoolReps,
      };

      console.log("Sending request:", requestBody);

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
      console.log("Response:", responseData);

      if (response.ok && responseData.status === true) {
        setShowSuccess(true);
        setShowModal(false);
        clearForm();
      } else {
        const errorMessage =
          responseData.message ||
          responseData.error ||
          `Registration failed with status ${response.status}`;
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => setShowSuccess(false);

  return (
    <>
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

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-badge mb-3">Ekeremgba 2.0 is coming soon...</div>

          <h1 className="hero-title">
            Developing Igbo language and Culture through
            <br />
            intellectual Competitions
          </h1>

          <p className="hero-description">
            Promoting pride in our heritage through education, creativity, and
            friendly competition among secondary schools in Nigeria.
          </p>

          <p>
            Next Competition:{" "}
            <span className="fw-bold">January 20th till February 4th 2026</span>
          </p>

          <div className="hero-buttons">
            <button onClick={openModal} className="btn btn-primary-custom">
              Register School (2026)
            </button>
            <Link href="/fixtures" className="btn btn-secondary-custom">
              View Fixtures
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showModal && (
        <div
          className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999 }}
          onClick={closeModal}
        >
          <div
            className="modal-content bg-white rounded-4 p-4 position-relative"
            style={{
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="close-button-modal position-absolute"
              style={{
                top: "15px",
                right: "15px",
                border: "none",
                background: "transparent",
                fontSize: "2rem",
                cursor: "pointer",
                lineHeight: 1,
              }}
              aria-label="Close"
              disabled={isLoading}
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

            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* School Info */}
              {["name", "address", "phone", "email"].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label text-muted">
                    {field.charAt(0).toUpperCase() + field.slice(1)}*
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    className="form-control form-input"
                    name={field}
                    placeholder={`Enter ${field}`}
                    value={formData[field]}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              ))}

              {/* Participants (3) */}
              <div className="mb-4">
                <label className="form-label text-muted mb-3">
                  Participants
                </label>
                <div className="representatives-grid">
                  {formData.participants.map((p, index) => (
                    <div
                      key={index}
                      className="rep-input-wrapper mb-2 d-flex align-items-center gap-2"
                    >
                      <span className="rep-label">{index + 1}.</span>
                      <input
                        type="text"
                        className="form-control rep-input"
                        placeholder="Full Name"
                        value={p}
                        onChange={(e) =>
                          handleParticipantChange(index, e.target.value)
                        }
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* School Reps / Coordinators */}
              <div className="mb-4">
                <label className="form-label text-muted mb-3">
                  School Coordinators
                </label>
                <div className="representatives-grid">
                  {formData.schoolReps.map((rep, index) => (
                    <div
                      key={index}
                      className="rep-input-wrapper mb-2 d-flex align-items-center gap-2"
                    >
                      <span className="rep-label">{index + 1}.</span>
                      <input
                        type="text"
                        className="form-control rep-input"
                        placeholder="Coordinator Name"
                        value={rep}
                        onChange={(e) =>
                          handleSchoolRepChange(index, e.target.value)
                        }
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="form-check mb-4 checkbox-container">
                <input
                  className="form-check-input custom-checkbox"
                  type="checkbox"
                  id="termsConditions"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={isLoading}
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
                style={{ backgroundColor: "#680B05" }}
                disabled={isLoading}
              >
                {isLoading ? (
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
        <div
          className="modal-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 9999 }}
        >
          <div
            className="modal-content bg-white rounded-4 p-4 text-center position-relative"
            style={{ maxWidth: "400px", width: "90%" }}
          >
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
            <button
              className="btn text-white px-4 py-2"
              style={{ backgroundColor: "#28a745" }}
              onClick={handleSuccessClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
