"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddSchoolModal({ show, onClose, onSchoolAdded }) {
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

    // Call onSchoolAdded to refresh the schools list if provided
    if (onSchoolAdded) {
      onSchoolAdded(); // This will close modal AND refresh the list
    } else {
      onClose(); // Fallback to just closing modal
    }

    // Optional: Redirect to schools list if not already there
    // Commenting this out since we want to stay on the same page and see the updated list
    // setTimeout(() => {
    //   router.push("/admin/dashboard/schools/schoollist");
    // }, 500);
  };

  // Handle regular modal close (without success)
  const handleModalClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <>
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

            <div className="mb-3">
              <label className="form-label">Number of Representatives</label>
              {[1, 2, 3, 4].map((n, index) => (
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

      {/* Success Popup */}
      {showSuccess && (
        <div className="modalOverlay">
          <div className="modalContent text-center">
            <div className="mb-3">
              <i className="bi bi-check-circle text-success fs-1"></i>
            </div>
            <h4 className="text-success mb-3">School Added Successfully!</h4>
            <p className="text-muted mb-4">
              The school has been registered successfully and has been added to
              your schools list.
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
