"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterModal = ({ onClose }) => {
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    participants: ["", "", "", ""],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleClose = () => {
    router.back();
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    // Validate required fields
    if (
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Filter out empty participants
      const filteredParticipants = formData.participants.filter(
        (participant) => participant.trim() !== ""
      );

      const requestBody = {
        name: formData.name,
        email: formData.email,
        phone: parseInt(formData.phone), // Convert to number as required by API
        address: formData.address,
        participants: filteredParticipants,
      };

      const response = await fetch(
        "https://api.ekeremgbaakpauche.com/register-school",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        // Show success popup
        setShowSuccess(true);
        // Clear form
        clearForm();
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        "Registration failed. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    handleClose(); // Close the modal after success
  };

  return (
    <>
      <div className="modal-overlay d-flex justify-content-center align-items-center">
        <div className="bg-white shadow p-4 modal-content-custom">
          <div className="d-flex justify-content-end">
            <button
              className="btn-close float end"
              onClick={handleClose}
              disabled={isLoading}
            ></button>
          </div>
          <h3 className="text-center fw-semibold">Register your School</h3>
          <p className="text-center mb-4 text-muted">
            Kindly fill this form to reach out to a Consultant
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">School name*</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Noah Naheem"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address*</label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Enter school address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone number*</label>
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

            <div className="mb-3">
              <label className="form-label">Email address*</label>
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

            <label className="form-label">Number of Representatives</label>
            <div className="row mb-3">
              {[1, 2, 3, 4].map((n, index) => (
                <div className="col-6 mb-2" key={n}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`${n}. Full Name`}
                    value={formData.participants[index]}
                    onChange={(e) =>
                      handleParticipantChange(index, e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>

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

            <button
              type="submit"
              className="btn w-100 join-button"
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

      {/* Success Popup */}
      {showSuccess && (
        <div className="modal-overlay d-flex justify-content-center align-items-center">
          <div className="bg-white shadow p-4 modal-content-custom text-center">
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

export default RegisterModal;
