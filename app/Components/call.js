"use client";

import { useState } from "react";

export default function CallToAction() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    participants: ["", "", ""], // reduced to 3
    schoolReps: ["", ""], // added coordinators
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

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
      const filteredParticipants = formData.participants.filter(
        (p) => p.trim() !== "",
      );
      const filteredSchoolReps = formData.schoolReps.filter(
        (rep) => rep.trim() !== "",
      );

      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
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
        },
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
    } catch (err) {
      console.error("Registration error:", err);
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError(
          "Network error. Please check your internet connection and try again.",
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
      <div className="py-5" style={{ backgroundColor: "#fafafa" }}>
        <div className="bannerContainer d-flex flex-column justify-content-center align-items-center text-white text-center">
          <h2 className="fw-bold mb-3">Ready to Join the Game?</h2>
          <button disabled onClick={openModal} className="btn registerBtn">
            Register School (2026)
          </button>
        </div>
      </div>

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

            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <form onSubmit={handleSubmit}>
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

              {/* Participants */}
              <div className="mb-4">
                <label className="form-label text-muted mb-3 fw-bold">
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

              {/* School Reps */}
              <div className="mb-4">
                <label className="form-label text-muted mb-3 fw-bold">
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
}
