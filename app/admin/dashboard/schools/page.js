"use client";

import AddSchoolModal from "@/app/Components/addschool";
import { useEffect, useMemo, useState } from "react";
import styles from "./schools.module.css";

export default function Schools() {
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ✅ Utility function to capitalize each word
  const capitalizeWords = (text) => {
    if (!text) return "";
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Fetch schools data from API on component mount
  useEffect(() => {
    fetchSchools();
  }, []);

  // Calculate pagination values
  const paginationData = useMemo(() => {
    const totalItems = schools.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = schools.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      currentItems,
      showingStart: startIndex + 1,
      showingEnd: Math.min(endIndex, totalItems),
    };
  }, [schools, currentPage, itemsPerPage]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { totalPages } = paginationData;
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
      setDropdownIndex(null);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

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

  const handleModalClose = (shouldRefresh = false) => {
    setShowModal(false);
    if (shouldRefresh) {
      fetchSchools();
    }
  };

  if (loading) {
    return (
      <div className="container mt-2">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-2">
        <div className="alert alert-danger" role="alert">
          <h5>Error Loading Schools</h5>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div
            className={`d-flex justify-content-between align-items-center ${styles.contentHeader}`}
          >
            <h4 className="fw-semi-bold">Schools</h4>
            <button
              className={styles.createBtn}
              onClick={() => setShowModal(true)}
            >
              Add Schools
            </button>
          </div>

          {schools.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <div className={styles.iconCircle}>
                  <i className="bi bi-mortarboard"></i>
                </div>
              </div>

              <h3 className={styles.emptyTitle}>No School</h3>
              <p className={styles.emptyText}>
                No Schools have registered in the system yet.
              </p>

              <button
                className={styles.startBtn}
                onClick={() => setShowModal(true)}
              >
                Add School
              </button>
            </div>
          ) : (
            <div className="table-responsive bg-white rounded-4 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <span className="me-2">Show</span>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="ms-2">entries</span>
                </div>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone number</th>
                    <th>Email</th>
                    <th>Students</th>
                    <th>Coordinators</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginationData.currentItems.map((school, index) => (
                    <tr key={`school-${school.school_id}-${index}`}>
                      <td>{school.id || "N/A"}</td>
                      <td>{capitalizeWords(school.name)}</td>
                      <td>{school.address}</td>
                      <td>{school.phone}</td>
                      <td>{school.email}</td>
                      <td>
                        {school.students?.length > 0 ? (
                          <div>
                            {school.students.map((student, i) => (
                              <div key={`student-${i}`} className="small">
                                {capitalizeWords(student.fullname)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">No students</span>
                        )}
                      </td>
                      <td>
                        {school.schoolReps?.length > 0 ? (
                          <div>
                            {school.schoolReps.map((rep, i) => (
                              <div key={`rep-${i}`} className="small">
                                {capitalizeWords(rep.rep_name)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">No coordinators</span>
                        )}
                      </td>

                      <td className="position-relative">
                        <button
                          className="btn btn-light rounded-circle"
                          onClick={() =>
                            setDropdownIndex(
                              dropdownIndex ===
                                `dropdown-${school.school_id}-${index}`
                                ? null
                                : `dropdown-${school.school_id}-${index}`
                            )
                          }
                        >
                          &#x22EE;
                        </button>
                        {dropdownIndex ===
                          `dropdown-${school.school_id}-${index}` && (
                          <div
                            className="position-absolute bg-white border rounded shadow-sm p-2 mt-2"
                            style={{ right: 0, zIndex: 10 }}
                          >
                            <button className="btn btn-sm w-100 text-start mb-1">
                              Edit School
                            </button>
                            <button className="btn btn-sm text-danger w-100 text-start">
                              Delete school
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-between align-items-center px-2 pt-2">
                <span>
                  Showing {paginationData.showingStart} to{" "}
                  {paginationData.showingEnd} of {paginationData.totalItems}{" "}
                  entries
                </span>

                {paginationData.totalPages > 1 && (
                  <nav aria-label="Table pagination">
                    <ul className="pagination mb-0">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          &laquo;
                        </button>
                      </li>

                      {getPageNumbers().map((page, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            page === "..." ? "disabled" : ""
                          } ${page === currentPage ? "active" : ""}`}
                        >
                          {page === "..." ? (
                            <span className="page-link">...</span>
                          ) : (
                            <button
                              className={`page-link ${
                                page === currentPage
                                  ? "bg-danger border-danger"
                                  : ""
                              }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          )}
                        </li>
                      ))}

                      <li
                        className={`page-item ${
                          currentPage === paginationData.totalPages
                            ? "disabled"
                            : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === paginationData.totalPages}
                        >
                          &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AddSchoolModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSchoolAdded={() => handleModalClose(true)}
      />
    </>
  );
}
