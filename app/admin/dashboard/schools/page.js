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
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (currentPage <= 3) {
        // Show first few pages
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // Show current page with context
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

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
      setDropdownIndex(null); // Close any open dropdowns
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  // Fetch schools function (extracted so it can be reused)
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://api.ekeremgbaakpauche.com/api/school/get-schools"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status && data.schools && data.schools.allSchools) {
        setSchools(data.schools.allSchools);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close and refresh data
  const handleModalClose = (shouldRefresh = false) => {
    setShowModal(false);
    // Refresh data if a school was added
    if (shouldRefresh) {
      fetchSchools();
    }
  };

  // Loading state
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

  // Error state
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
          {/* Schools Header */}
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

          {/* Conditional rendering based on schools length */}
          {schools.length === 0 ? (
            // Empty State - Show when no schools
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <div className={styles.iconCircle}>
                  <i className="bi bi-mortarboard"></i>
                </div>
              </div>

              <h3 className={styles.emptyTitle}>No School</h3>
              <p className={styles.emptyText}>
                You have not created any school competition
              </p>

              <button
                className={styles.startBtn}
                onClick={() => setShowModal(true)}
              >
                Add School
              </button>
            </div>
          ) : (
            // Schools Table - Show when schools exist
            <div className="table-responsive bg-white rounded-4 p-3">
              {/* Items per page selector */}
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
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone number</th>
                    <th>Email</th>
                    <th>Students</th>
                    <th>Date added</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginationData.currentItems.map((school, index) => (
                    <tr key={`school-${school.school_id}-${index}`}>
                      <td>{school.name}</td>
                      <td>{school.address}</td>
                      <td>{school.phone}</td>
                      <td>{school.email}</td>
                      <td>
                        {school.students && school.students.length > 0 ? (
                          <div>
                            {school.students.map((student, studentIndex) => (
                              <div
                                key={`student-${student.id}-${school.school_id}-${studentIndex}`}
                                className="small"
                              >
                                {student.fullname}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">No students</span>
                        )}
                      </td>
                      <td>{formatDate(school.time_stamp)}</td>
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

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center px-2 pt-2">
                <span>
                  Showing {paginationData.showingStart} to{" "}
                  {paginationData.showingEnd} of {paginationData.totalItems}{" "}
                  entries
                </span>

                {paginationData.totalPages > 1 && (
                  <nav aria-label="Table pagination">
                    <ul className="pagination mb-0">
                      {/* Previous button */}
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

                      {/* Page numbers */}
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

                      {/* Next button */}
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

      {/* Right Slide Modal */}
      <AddSchoolModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSchoolAdded={() => handleModalClose(true)}
      />
    </>
  );
}
