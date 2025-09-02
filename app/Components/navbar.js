"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    participants: ["", "", "", ""],
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (href) => pathname === href;

  const openModal = () => {
    setShowModal(true);
    setError(""); // Clear any previous errors
    // Close mobile menu if open
    setIsOpen(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setError(""); // Clear errors when closing
    // Clear form when closing
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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }

    // Validate required fields
    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      // Filter out empty participants
      const filteredParticipants = formData.participants.filter(
        (participant) => participant.trim() !== ""
      );

      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(), // Keep as string, don't convert to int
        address: formData.address.trim(),
        participants: filteredParticipants,
      };

      console.log("Sending request:", requestBody); // Debug log

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
      console.log("Response:", responseData); // Debug log

      if (response.ok && responseData.status === true) {
        // Show success popup
        setShowSuccess(true);
        setShowModal(false);
        // Clear form
        clearForm();
      } else {
        // Handle API error response
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

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <nav
        className="navbar navbar-light shadow-sm sticky-top px-3 px-md-5 py-2"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Left: Toggle (small only) + Brand */}
          <div className="d-flex align-items-center">
            {/* Toggle visible only on small screens */}
            <button
              onClick={toggleNavbar}
              className="border-0 bg-transparent p-0 me-2 toggle-btn d-md-none"
              style={{ color: "#680B05" }}
              type="button"
              aria-label="Toggle navigation"
            >
              <span className="fs-4">
                <i className={isOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
              </span>
            </button>

            {/* Brand always visible */}
            <Link href="/" className="navbar-brand fw-bold fs-4 mb-0">
              <Image
                src="/images/logo.png"
                width={130}
                height={60}
                alt="logo"
              ></Image>
            </Link>
          </div>

          {/* Center: Desktop menu */}
          <ul className="navbar-nav mx-auto d-none d-md-flex flex-row align-items-center gap-4 mb-0">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/fixtures"
                className={`nav-link ${isActive("/fixtures") ? "active" : ""}`}
              >
                Fixtures
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/schools"
                className={`nav-link ${isActive("/schools") ? "active" : ""}`}
              >
                Schools
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/about"
                className={`nav-link ${isActive("/about") ? "active" : ""}`}
              >
                About
              </Link>
            </li>
          </ul>

          {/* Right: Desktop login/signup buttons */}
          <div className="d-none d-md-flex gap-2 align-items-center">
            <div className="dropdown">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="languageDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  borderRadius: "10px",
                  color: "#333333",
                  border: "2px solid #f2f2f2",
                  backgroundColor: "white",
                }}
              >
                English
              </button>

              <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => console.log("Switched to Igbo")}
                  >
                    Igbo
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => console.log("Switched to German")}
                  >
                    German
                  </button>
                </li>
              </ul>
            </div>

            <button
              onClick={openModal}
              className="btn btn-light navaa p-3"
              style={{ borderRadius: "35px" }}
            >
              Register your School
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`mobile-nav bg-white shadow position-fixed top-0 start-0 h-100 p-4 d-flex flex-column ${
          isOpen ? "open" : ""
        }`}
      >
        {/* Brand + Close button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link
            href="/"
            className="navbar-brand fw-bold fs-4 mb-0"
            style={{ color: "#680B05" }}
          >
            Ekeremgba
          </Link>
          <button
            onClick={toggleNavbar}
            className="btn-close"
            aria-label="Close"
          ></button>
        </div>

        <ul className="list-unstyled flex-grow-1">
          <li className="mb-3">
            <Link
              href="/"
              className={`text-decoration-none side-text ${
                isActive("/") ? "active" : ""
              }`}
              onClick={toggleNavbar}
            >
              <i className="fa-solid fa-house me-2"></i>
              Home
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/fixtures"
              className={`text-decoration-none side-text ${
                isActive("/fixtures") ? "active" : ""
              }`}
              onClick={toggleNavbar}
            >
              <i className="fa-solid fa-book-open-reader me-2"></i>
              Fixtures
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/schools"
              className={`text-decoration-none side-text ${
                isActive("/schools") ? "active" : ""
              }`}
              onClick={toggleNavbar}
            >
              <i className="fa-solid fa-circle-info me-2"></i>
              Schools
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/contact"
              className={`text-decoration-none side-text ${
                isActive("/contact") ? "active" : ""
              }`}
              onClick={toggleNavbar}
            >
              <i className="fa-solid fa-circle-info me-2"></i>
              About Us
            </Link>
          </li>
        </ul>

        <div className="d-flex gap-2 mt-auto flex-column">
          <div
            className="btn w-100"
            onClick={toggleNavbar}
            style={{
              borderRadius: "10px",
              color: "#333333",
              border: "2px solid #f2f2f2",
            }}
          >
            English <i className="fa-solid fa-angle-down"></i>
          </div>

          <button
            onClick={openModal}
            className="btn text-light navaa p-2 side-butt w-100"
            style={{ borderRadius: "35px" }}
          >
            Register your School
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
            {/* Close button - Inside the modal, top-right corner */}
            <button
              onClick={closeModal}
              className="close-button-modal position-absolute"
              aria-label="Close"
              disabled={isLoading}
            >
              ×
            </button>

            {/* Modal Header */}
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2" style={{ color: "#333" }}>
                Register your School
              </h2>
              <p className="text-muted mb-0">
                Kindly fill this form to reach out to a Consultant
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Registration Form */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                        disabled={isLoading}
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
