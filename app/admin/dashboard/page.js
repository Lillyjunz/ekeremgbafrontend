"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  // Simulate loading and navigate
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(false);
      router.push("/admin/dashboard/tournament"); // replace with your route
    }, 2000); // simulate loading
  };

  return (
    <div className="row">
      <div className="col-12">
        {/* Header */}
        <div
          className={`d-flex justify-content-between align-items-center ${styles.contentHeader}`}
        >
          <div className={styles.tournamentSelector}>
            <div
              className="dropdown p-2"
              style={{
                border: "2px solid #f2f2f2",
                borderRadius: "15px",
                backgroundColor: "#fff",
              }}
            >
              <button
                className={`btn  ${styles.tournamentBtn}`}
                type="button"
                data-bs-toggle="dropdown"
              >
                Ekeremgba - Akpauche 2025
                <i className="bi bi-chevron-down ms-2"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Ekeremgba - Akpauche 2025
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Tournament 2024
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Championship 2023
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <button
            className={styles.createBtn}
            onClick={() => setShowModal(true)}
          >
            Create Tournament
          </button>
        </div>

        {/* Empty State */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <div className={styles.iconCircle}>
              <i className="bi bi-trophy"></i>
            </div>
          </div>
          <h3 className={styles.emptyTitle}>No Tournament</h3>
          <p className={styles.emptyText}>
            You have not created any competition
          </p>
          <button
            className={styles.startBtn}
            onClick={() => setShowModal(true)}
          >
            Start a Competition
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalPanel}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Tournament</h5>
              <button
                onClick={() => {
                  setShowModal(false);
                  setStep(1);
                  setIsLoading(false);
                }}
                className="btn-close"
              ></button>
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
              >
                <div className="mb-3">
                  <label className="form-label">
                    Tournament Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ekeremgba - Akpauche 2025"
                  />
                </div>
                <div className="row">
                  <div className="col">
                    <label className="form-label">
                      Number of participants
                      <span className="text-danger">*</span>
                    </label>
                    <select className="form-select shadow-none">
                      <option>Select</option>
                    </select>
                  </div>
                  <div className="col">
                    <label className="form-label">
                      Number of groups<span className="text-danger">*</span>
                    </label>
                    <select className="form-select shadow-none">
                      <option>Select</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col">
                    <label className="form-label">Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Date"
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">Time</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Time"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Location"
                  />
                </div>
                <div className="mt-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Description"
                  ></textarea>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      background: "linear-gradient(to right, #b30000, #660000)",
                      color: "#fff",
                      borderRadius: "30px",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 */}
            {step === 2 && !isLoading && (
              <form onSubmit={handleFinalSubmit}>
                <h6 className="fw-bold mb-3">Second Form Step</h6>
                <div className="mb-3">
                  <label className="form-label">Additional Field</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    background: "#333",
                    color: "#fff",
                    borderRadius: "30px",
                  }}
                >
                  Submit
                </button>
              </form>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-danger"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Creating Tournament...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
