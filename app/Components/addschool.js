"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddSchoolModal({ show, onClose }) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Simulate server delay
    setTimeout(() => {
      router.push("/admin/dashboard/schools/schoollist");
    }, 2000);
  };

  if (!show) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeBtn" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        <h5 className="mb-4">Add a School</h5>

        {submitted ? (
          <div className="text-center my-5">
            <i className="bi bi-check-circle text-success fs-1"></i>
            <p className="mt-3 fs-5 fw-semibold">School added successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                School name<span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Address<span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Phone number<span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Email address<span className="text-danger">*</span>
              </label>
              <input type="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Number of Representatives</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="1."
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="2."
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="3."
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="4."
              />
            </div>
            <button type="submit" className="submitBtn btn">
              Add School
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
