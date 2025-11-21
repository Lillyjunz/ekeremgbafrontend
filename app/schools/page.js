"use client";

import { useEffect, useState } from "react";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import styles from "./schools.module.css";

export default function SchoolsList() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://api.ekeremgbaakpauche.com/api/school/get-schools"
        );

        if (!response.ok) {
          console.warn("Failed to fetch schools:", response.status);
          setSchools([]);
          return;
        }

        const data = await response.json();
        const allSchools = data?.schools?.allSchools ?? [];

        setSchools(Array.isArray(allSchools) ? allSchools : []);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const capitalizeWords = (str) =>
    str
      ? str
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "N/A";

  const EmptyState = () => (
    <div className="text-center py-5">
      <div className="mb-4">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: "0 auto", display: "block" }}
        >
          <circle cx="60" cy="60" r="60" fill="#f0f0f0" />
          <path
            d="M40 50h40M40 60h40M40 70h30"
            stroke="#d0d0d0"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect
            x="35"
            y="35"
            width="50"
            height="55"
            rx="4"
            stroke="#d0d0d0"
            strokeWidth="2"
            fill="none"
          />
          <path d="M45 35v-5a5 5 0 0110 0v5" stroke="#d0d0d0" strokeWidth="2" />
        </svg>
      </div>
      <h4 className="fw-semibold mb-2" style={{ color: "#333" }}>
        No Schools Found
      </h4>
      <p
        className="text-muted mb-4"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        There are currently no schools registered in the system. Schools will
        appear here once they are added.
      </p>
      <button
        className="btn btn-outline-secondary"
        style={{
          borderRadius: "8px",
          padding: "10px 24px",
          fontWeight: "500",
        }}
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#fafafa" }}>
        <div className="container py-3 py-md-5">
          <div className={styles.rankingWrapper}>
            <h3 className="mb-3 mb-md-4 fw-bold">Schools</h3>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading schools...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
              </div>
            ) : schools.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="d-none d-md-block table-responsive">
                  <table className="table mb-0">
                    <thead>
                      <tr className="text-muted">
                        <th>No.</th>
                        <th>School Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>No. of Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schools.map((school, index) => (
                        <tr key={school.school_id}>
                          <td>{index + 1}</td>
                          <td>{capitalizeWords(school.name)}</td>
                          <td>{school.phone}</td>
                          <td>{school.email}</td>
                          <td>{school.students?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="d-md-none">
                  {schools.map((school, index) => (
                    <div
                      key={school.school_id}
                      className="card mb-3"
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0" style={{ flex: 1 }}>
                            {capitalizeWords(school.name)}
                          </h6>
                          <span
                            className="badge bg-primary"
                            style={{ fontSize: "0.75rem" }}
                          >
                            #{index + 1}
                          </span>
                        </div>

                        <div className="mt-3" style={{ fontSize: "0.9rem" }}>
                          <div className="mb-2">
                            <span
                              className="text-muted d-inline-block"
                              style={{ width: "80px" }}
                            >
                              Phone:
                            </span>
                            <span className="fw-medium">{school.phone}</span>
                          </div>

                          <div className="mb-2">
                            <span
                              className="text-muted d-inline-block"
                              style={{ width: "80px" }}
                            >
                              Email:
                            </span>
                            <span
                              className="fw-medium"
                              style={{
                                wordBreak: "break-word",
                                fontSize: "0.85rem",
                              }}
                            >
                              {school.email}
                            </span>
                          </div>

                          <div>
                            <span
                              className="text-muted d-inline-block"
                              style={{ width: "80px" }}
                            >
                              Students:
                            </span>
                            <span className="fw-medium">
                              {school.students?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
