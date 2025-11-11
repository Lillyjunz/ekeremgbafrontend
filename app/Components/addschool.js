"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddSchoolModal({ show, onClose, onSchoolAdded }) {
  const router = useRouter();

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    participants: ["", "", ""],
    schoolReps: ["", ""], // ✅ Added two coordinator fields
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // ✅ Handle general input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle participant change
  const handleParticipantChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p, i) => (i === index ? value : p)),
    }));
  };

  // ✅ Handle coordinator (schoolRep) change
  const handleRepChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      schoolReps: prev.schoolReps.map((rep, i) => (i === index ? value : rep)),
    }));
  };

  // ✅ Clear all fields
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
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    if (
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const filteredParticipants = formData.participants.filter(
      (p) => p.trim() !== ""
    );
    if (filteredParticipants.length === 0) {
      alert("Please enter at least one participant");
      return;
    }

    const filteredReps = formData.schoolReps.filter((r) => r.trim() !== "");
    if (filteredReps.length === 0) {
      alert("Please enter at least one coordinator");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        name: formData.name,
        email: formData.email,
        phone: Number(formData.phone),
        address: formData.address,
        participants: filteredParticipants,
        schoolReps: filteredReps, // ✅ Send coordinators to API
      };

      console.log("Request body:", requestBody);

      const response = await fetch(
        "https://api.ekeremgbaakpauche.com/api/school/register-school",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("API response:", data);

      if (response.ok && data.status === true) {
        setShowSuccess(true);
        clearForm();
      } else {
        alert(
          `Registration failed: ${data.message || "Could not create a school"}`
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle success modal close
  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onSchoolAdded) {
      onSchoolAdded();
    } else {
      onClose();
    }
  };

  // ✅ Handle cancel/close
  const handleModalClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="modalOverlay">
        <div className="modalContent">
          <button
            className="closeBtn"
            onClick={handleModalClose}
            disabled={isLoading}
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <h5 className="mb-4">Add a School</h5>

          <form onSubmit={handleSubmit}>
            {/* School Name */}
            <div className="mb-3">
              <label className="form-label">
                School name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">
                Address<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">
                Phone number<span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="08012345678"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">
                Email address<span className="text-danger">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="school@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            {/* Participants */}
            <div className="mb-3">
              <label className="form-label">Number of Representatives</label>
              {[1, 2, 3].map((n, index) => (
                <input
                  key={n}
                  type="text"
                  className="form-control mb-2"
                  placeholder={`${n}. Full Name`}
                  value={formData.participants[index]}
                  onChange={(e) =>
                    handleParticipantChange(index, e.target.value)
                  }
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Coordinators */}
            <div className="mb-3">
              <label className="form-label">
                School Coordinators<span className="text-danger">*</span>
              </label>
              {[1, 2].map((n, index) => (
                <input
                  key={n}
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Coordinator ${n} Name`}
                  value={formData.schoolReps[index]}
                  onChange={(e) => handleRepChange(index, e.target.value)}
                  disabled={isLoading}
                  required={index === 0} // Require at least the first one
                />
              ))}
            </div>

            {/* Terms Checkbox */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={isLoading}
                required
              />
              <label className="form-check-label" htmlFor="terms">
                Accept our Terms and Conditions
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="submitBtn btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Adding School...
                </>
              ) : (
                "Add School"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="modalOverlay">
          <div className="modalContent text-center">
            <div className="mb-3">
              <i className="bi bi-check-circle text-success fs-1"></i>
            </div>
            <h4 className="text-success mb-3">School Added Successfully!</h4>
            <p className="text-muted mb-4">
              The school has been registered successfully and added to your
              list.
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
