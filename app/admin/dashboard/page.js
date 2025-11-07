"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [availableSchools, setAvailableSchools] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2026");

  const [tournamentData, setTournamentData] = useState({
    name: "",
    year: "",
    event_time: "",
    event_date: "", // ✅ Added event_date
    location: "",
    description: "",
  });

  const [schoolFormData, setSchoolFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    emailAddress: "",
    participants: ["", "", ""],
  });

  const router = useRouter();

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ekereAuthToken");
    }
    return null;
  };

  const resetAll = () => {
    setShowModal(false);
    setIsLoading(false);
    setError("");
    setSuccess("");
    setTournamentData({
      name: "",
      year: "",
      event_time: "",
      event_date: "", // ✅ Reset event_date
      location: "",
      description: "",
    });
  };

  const resetSchoolModal = () => {
    setShowSchoolModal(false);
    setSelectedSchools([]);
    setSelectedTournamentId(null);
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    async function fetchTournaments() {
      setLoadingTournaments(true);
      try {
        const token = getAuthToken();

        const url = selectedYear
          ? `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${selectedYear}`
          : "https://api.ekeremgbaakpauche.com/api/admin/tournaments";

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setTournaments(data);
        } else {
          setTournaments([]);
          console.error("Failed to fetch tournaments", data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTournaments(false);
      }
    }

    fetchTournaments();
  }, [selectedYear]);

  const fetchSchools = async () => {
    try {
      const res = await fetch(
        "https://api.ekeremgbaakpauche.com/api/school/get-schools"
      );
      const data = await res.json();

      if (res.ok && data.status) {
        const schools = data.schools.allSchools.map((s) => ({
          id: s.id,
          school_id: s.school_id,
          name: s.name,
          address: s.address,
          phoneNumber: s.phone,
          emailAddress: s.email,
          students: s.students || [],
        }));
        setAvailableSchools(schools);
      } else {
        console.error("Failed to fetch schools", data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      showModal || showSchoolModal ? "hidden" : "auto";
  }, [showModal, showSchoolModal]);

  const handleTournamentDataChange = (field, value) => {
    setTournamentData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleSchoolSelection = (schoolId) => {
    setSelectedSchools((prev) =>
      prev.includes(schoolId)
        ? prev.filter((id) => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const addAll = () => setSelectedSchools(availableSchools.map((s) => s.id));
  const removeAll = () => setSelectedSchools([]);

  const handleSchoolFormChange = (field, value) => {
    setSchoolFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleParticipantChange = (index, value) => {
    const updated = [...schoolFormData.participants];
    updated[index] = value;
    setSchoolFormData((prev) => ({ ...prev, participants: updated }));
  };

  const addParticipantField = () => {
    setSchoolFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, ""],
    }));
  };

  const removeParticipantField = (index) => {
    if (schoolFormData.participants.length <= 3) {
      setError("Minimum 3 participants required");
      setTimeout(() => setError(""), 3000);
      return;
    }
    const updated = schoolFormData.participants.filter((_, i) => i !== index);
    setSchoolFormData((prev) => ({ ...prev, participants: updated }));
  };

  const handleSchoolFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (schoolFormData.participants.length < 3) {
      setError("Please add at least 3 participants");
      return;
    }

    const validParticipants = schoolFormData.participants.filter(
      (p) => p.trim() !== ""
    );
    if (validParticipants.length < 3) {
      setError("Please fill in at least 3 participant names");
      return;
    }

    const uniqueNames = new Set(
      validParticipants.map((p) => p.trim().toLowerCase())
    );
    if (uniqueNames.size < validParticipants.length) {
      setError("Participant names must be unique");
      return;
    }

    try {
      const token = getAuthToken();

      const payload = {
        name: schoolFormData.name,
        address: schoolFormData.address,
        phone: schoolFormData.phoneNumber,
        email: schoolFormData.emailAddress,
        participants: validParticipants.map((p) => p.trim()),
      };

      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/school/register-school`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok && data.status && data.new_school) {
        const newSchool = {
          id: data.new_school.id || Date.now(),
          school_id: data.new_school.school_id,
          name: data.new_school.name,
          address: data.new_school.address,
          phoneNumber: data.new_school.phone,
          emailAddress: data.new_school.email,
          students:
            data.new_school.participants?.map((p, i) => ({
              id: Date.now() + i,
              fullname: p,
              class: null,
            })) || [],
        };

        setAvailableSchools((prev) => [...prev, newSchool]);
        setSelectedSchools((prev) => [...prev, newSchool.id]);

        setSuccess("School added successfully!");

        await fetchSchools();

        setShowSchoolForm(false);

        setSchoolFormData({
          name: "",
          address: "",
          phoneNumber: "",
          emailAddress: "",
          participants: ["", "", ""],
        });
      } else {
        throw new Error(data.message || "Add school failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error adding school");
    }
  };

  const createTournament = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Missing auth token, please log in again.");
      router.push("/login");
      return;
    }

    const payload = {
      name: tournamentData.name,
      year: tournamentData.year,
      event_time: tournamentData.event_time,
      event_date: tournamentData.event_date, // ✅ Include event_date
      location: tournamentData.location,
      description: tournamentData.description,
    };

    try {
      const res = await fetch(
        "https://api.ekeremgbaakpauche.com/api/admin/create-tournament",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Tournament created successfully!");
        console.log("Tournament ID:", data.tournamentId);

        setTimeout(() => {
          resetAll();
          window.location.reload();
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to create tournament");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating tournament");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await createTournament();
    setIsLoading(false);
  };

  const handleAddSchools = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setShowSchoolModal(true);
  };

  // ✅ Helper function to display date (text as-is, no formatting needed)
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // Return the date as entered by user (e.g., "20th Jan 2026")
    return dateString;
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
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
                  className={`btn ${styles.tournamentBtn}`}
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  {selectedYear === ""
                    ? "All Tournaments"
                    : `Ekeremgba - Akpauche ${selectedYear}`}
                  <i className="bi bi-chevron-down ms-2"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedYear("");
                      }}
                    >
                      All Tournaments
                    </a>
                  </li>
                  {[2027, 2026, 2025, 2024, 2023].map((year) => (
                    <li key={year}>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedYear(year.toString());
                        }}
                      >
                        {year}
                      </a>
                    </li>
                  ))}
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

          {loadingTournaments ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading tournaments...</p>
            </div>
          ) : tournaments.length === 0 ? (
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
          ) : (
            <div className="row mt-4">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="col-md-6 col-lg-4 mb-4">
                  <div
                    className="card h-100 shadow-sm"
                    style={{ borderRadius: "15px" }}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-start mb-3">
                        <div
                          className="me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(to right, #b30000, #660000)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                          }}
                        >
                          <i className="bi bi-trophy-fill fs-4"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-1 fw-bold">
                            {tournament.name}
                          </h5>
                          <small className="text-muted">
                            Year: {tournament.year}
                          </small>
                        </div>
                      </div>
                      <p className="card-text text-muted small">
                        {tournament.description}
                      </p>
                      <div className="mt-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                          <small>{tournament.location}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-clock-fill text-danger me-2"></i>
                          <small>{tournament.event_time}</small>
                        </div>
                        {/* ✅ Display event_date prominently */}
                        {tournament.event_date && (
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-calendar-event-fill text-danger me-2"></i>
                            <small>{formatDate(tournament.event_date)}</small>
                          </div>
                        )}
                        {/* ✅ Moved created_at to bottom with smaller text */}
                        <div
                          className="d-flex align-items-center mt-3 pt-2"
                          style={{ borderTop: "1px solid #f0f0f0" }}
                        >
                          <i
                            className="bi bi-info-circle text-muted me-2"
                            style={{ fontSize: "0.85rem" }}
                          ></i>
                          <small
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Created:{" "}
                            {new Date(
                              tournament.created_at
                            ).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      <div className="mt-3 d-flex flex-wrap gap-2">
                        <button
                          className="btn btn-sm flex-grow-1"
                          style={{
                            background:
                              "linear-gradient(to right, #b30000, #660000)",
                            color: "#fff",
                            borderRadius: "20px",
                          }}
                          onClick={() => handleAddSchools(tournament.id)}
                        >
                          <i className="bi bi-plus-circle me-1"></i>
                          Add Schools
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          style={{ borderRadius: "20px" }}
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/tournament/${tournament.id}/schools`
                            )
                          }
                        >
                          <i className="bi bi-eye me-1"></i>
                          View Schools
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          style={{
                            borderRadius: "20px",
                          }}
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/tournament/${tournament.id}/brackets`
                            )
                          }
                        >
                          <i className="bi bi-diagram-3-fill me-1"></i>
                          Groups
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          style={{
                            borderRadius: "20px",
                          }}
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/tournament/${tournament.id}/leaderboard`
                            )
                          }
                        >
                          <i className="bi bi-bar-chart-fill me-1"></i>
                          Leaderboard
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          style={{ borderRadius: "20px" }}
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/tournament/${tournament.id}/scoreboard`
                            )
                          }
                        >
                          <i className="bi bi-trophy me-1"></i>
                          Scoreboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Tournament Modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalPanel}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">Create Tournament</h5>
                <button onClick={resetAll} className="btn-close" />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {!isLoading ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Tournament Name<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ekeremgba - Akpauche 2025"
                      value={tournamentData.name}
                      onChange={(e) =>
                        handleTournamentDataChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="row mt-3">
                    <div className="col">
                      <label className="form-label">
                        Year<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="2025"
                        value={tournamentData.year}
                        onChange={(e) =>
                          handleTournamentDataChange("year", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">
                        Event Time<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="03:00pm"
                        value={tournamentData.event_time}
                        onChange={(e) =>
                          handleTournamentDataChange(
                            "event_time",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* ✅ Added Event Date input */}
                  <div className="mt-3">
                    <label className="form-label">
                      Event Date<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., 20th Jan 2026"
                      value={tournamentData.event_date}
                      onChange={(e) =>
                        handleTournamentDataChange("event_date", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Location"
                      value={tournamentData.location}
                      onChange={(e) =>
                        handleTournamentDataChange("location", e.target.value)
                      }
                    />
                  </div>
                  <div className="mt-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Description"
                      value={tournamentData.description}
                      onChange={(e) =>
                        handleTournamentDataChange(
                          "description",
                          e.target.value
                        )
                      }
                    ></textarea>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn w-100"
                      style={{
                        background:
                          "linear-gradient(to right, #b30000, #660000)",
                        color: "#fff",
                        borderRadius: "30px",
                      }}
                    >
                      Create Tournament
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-danger"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                  <p className="mt-3">Creating your tournament...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Schools Modal */}
        {showSchoolModal && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modalPanel} ${styles.modalPanelWide}`}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">Add Schools to Tournament</h5>
                <button onClick={resetSchoolModal} className="btn-close" />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {!isLoading ? (
                <div className={styles.addSchoolsContainer}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="fw-bold mb-0">Select Schools</h6>
                    <button
                      className={styles.addAllBtn}
                      onClick={
                        selectedSchools.length === availableSchools.length
                          ? removeAll
                          : addAll
                      }
                    >
                      {selectedSchools.length === availableSchools.length
                        ? "Remove All"
                        : "Add All"}
                    </button>
                  </div>

                  <div className={styles.schoolsList}>
                    {availableSchools.map((s) => (
                      <div key={s.id} className={styles.schoolItem}>
                        <span className={styles.schoolName}>{s.name}</span>
                        <button
                          className={`${styles.addBtn} ${
                            selectedSchools.includes(s.id)
                              ? styles.addBtnActive
                              : ""
                          }`}
                          onClick={() => toggleSchoolSelection(s.id)}
                        >
                          {selectedSchools.includes(s.id) ? "Added" : "Add"}
                        </button>
                      </div>
                    ))}

                    <button
                      className={styles.addNewSchoolBtn}
                      onClick={() => setShowSchoolForm(true)}
                    >
                      <i className="bi bi-plus"></i> Add New School
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={async () => {
                        if (selectedSchools.length === 0) return;

                        const uniqueSelectedSchools = [
                          ...new Set(selectedSchools),
                        ];
                        let successCount = 0;
                        let failedSchools = [];

                        const token = getAuthToken();

                        for (const id of uniqueSelectedSchools) {
                          try {
                            const res = await fetch(
                              `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${selectedTournamentId}/register`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ schoolId: id }),
                              }
                            );

                            const data = await res.json();
                            if (!res.ok)
                              throw new Error(data.message || "Failed");
                            successCount++;
                          } catch (err) {
                            failedSchools.push(id);
                            console.error(
                              `Failed to add school ${id}:`,
                              err.message
                            );
                          }
                        }

                        Swal.fire({
                          icon:
                            failedSchools.length === 0 ? "success" : "warning",
                          title: "Add Schools Result",
                          html: `<p><strong>${successCount}</strong> school(s) added successfully.</p>
         ${
           failedSchools.length > 0
             ? `<p><strong>${failedSchools.length}</strong> school(s) failed to add.</p>`
             : ""
         }`,
                        });

                        setSelectedSchools([]);
                        resetSchoolModal();
                      }}
                      className="btn w-100"
                      style={{
                        background:
                          "linear-gradient(to right, #b30000, #660000)",
                        color: "#fff",
                        borderRadius: "30px",
                      }}
                      disabled={selectedSchools.length === 0}
                    >
                      Add Schools to Tournament ({selectedSchools.length}{" "}
                      selected)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-danger"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                  <p className="mt-3">Adding schools to tournament...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add School Form Modal */}
        {showSchoolForm && (
          <div className={styles.modalOverlay} style={{ zIndex: 1060 }}>
            <div
              className={styles.modalPanel}
              style={{ maxWidth: "500px", width: "90%" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold">Add a School</h5>
                <button
                  onClick={() => {
                    setShowSchoolForm(false);
                    setError("");
                  }}
                  className="btn-close"
                />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSchoolFormSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    School Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={schoolFormData.name}
                    onChange={(e) =>
                      handleSchoolFormChange("name", e.target.value)
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Address<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={schoolFormData.address}
                    onChange={(e) =>
                      handleSchoolFormChange("address", e.target.value)
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Phone Number<span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    required
                    value={schoolFormData.phoneNumber}
                    onChange={(e) =>
                      handleSchoolFormChange("phoneNumber", e.target.value)
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Email Address<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={schoolFormData.emailAddress}
                    onChange={(e) =>
                      handleSchoolFormChange("emailAddress", e.target.value)
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Participants{" "}
                    <span className="text-muted small">
                      (Minimum 3 required)
                    </span>
                    <span className="text-danger">*</span>
                  </label>
                  <div className="alert alert-info py-2 small mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Please enter the full names of at least 3 participants
                  </div>

                  {schoolFormData.participants.map((p, i) => (
                    <div key={i} className="mb-3">
                      <div className="input-group">
                        <span
                          className="input-group-text"
                          style={{
                            minWidth: "45px",
                            justifyContent: "center",
                          }}
                        >
                          {i + 1}
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Participant ${i + 1} - Full Name`}
                          value={p}
                          onChange={(e) =>
                            handleParticipantChange(i, e.target.value)
                          }
                          required
                        />
                        {schoolFormData.participants.length > 3 && (
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeParticipantField(i)}
                            title="Remove participant"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm w-100"
                    onClick={addParticipantField}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Another Participant
                  </button>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      background: "linear-gradient(to right, #b30000, #660000)",
                      color: "#fff",
                      borderRadius: "30px",
                    }}
                  >
                    Add School
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
