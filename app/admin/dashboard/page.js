"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [selectedYear, setSelectedYear] = useState("2025");

  const [tournamentData, setTournamentData] = useState({
    name: "",
    year: "",
    event_time: "",
    location: "",
    description: "",
  });

  const [schoolFormData, setSchoolFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    emailAddress: "",
    participants: [""],
  });

  const router = useRouter();

  // Get token from localStorage
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ekereAuthToken");
    }
    return null;
  };

  // Reset form state
  const resetAll = () => {
    setShowModal(false);
    setIsLoading(false);
    setError("");
    setSuccess("");
    setTournamentData({
      name: "",
      year: "",
      event_time: "",
      location: "",
      description: "",
    });
  };

  // Reset school modal
  const resetSchoolModal = () => {
    setShowSchoolModal(false);
    setSelectedSchools([]);
    setSelectedTournamentId(null);
    setError("");
    setSuccess("");
  };

  // Fetch all tournaments

  useEffect(() => {
    async function fetchTournaments() {
      setLoadingTournaments(true);
      try {
        const token = getAuthToken();

        // Determine URL based on selectedYear
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

  // Fetch schools
  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch(
          "https://api.ekeremgbaakpauche.com/api/school/get-schools"
        );
        const data = await res.json();
        if (res.ok && data.status) {
          const schools = data.schools.allSchools.map((s) => ({
            school_id: s.school_id,
            name: s.name,
            address: s.address,
            phoneNumber: s.phone,
            emailAddress: s.email,
            participants: s.participants || [],
          }));
          setAvailableSchools(schools);
        } else {
          console.error("Failed to fetch schools", data);
        }
      } catch (err) {
        console.error(err);
      }
    }
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

  const toggleSchoolSelection = (id) =>
    setSelectedSchools((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

  const addAll = () =>
    setSelectedSchools(availableSchools.map((s) => s.school_id));

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
    const updated = schoolFormData.participants.filter((_, i) => i !== index);
    setSchoolFormData((prev) => ({ ...prev, participants: updated }));
  };

  const handleSchoolFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = getAuthToken();

      const payload = {
        name: schoolFormData.name,
        address: schoolFormData.address,
        phone: schoolFormData.phoneNumber,
        email: schoolFormData.emailAddress,
        participants: schoolFormData.participants,
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
          school_id: data.new_school.school_id || Date.now().toString(),
          name: data.new_school.name,
          address: data.new_school.address,
          phoneNumber: data.new_school.phone,
          emailAddress: data.new_school.email,
          participants: data.new_school.participants || [],
        };
        setAvailableSchools((prev) => [...prev, newSchool]);
        setSelectedSchools((prev) => [...prev, newSchool.school_id]);
        setSuccess("School added successfully!");
        setShowSchoolForm(false);
        setSchoolFormData({
          name: "",
          address: "",
          phoneNumber: "",
          emailAddress: "",
          participants: [""],
        });
      } else {
        throw new Error(data.message || "Add school failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error adding school");
    }
  };

  // Create Tournament
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
        // ✅ Updated to use new response format
        setSuccess(data.message || "Tournament created successfully!");
        console.log("Tournament ID:", data.tournamentId);

        // ✅ Auto-close modal after success
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

  // Open Add Schools Modal for specific tournament
  const handleAddSchools = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setShowSchoolModal(true);
  };

  // Handle adding schools to tournament

  const handleAddSchoolsToTournament = async (schoolId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("No admin token found. Please log in again.");
        return;
      }

      if (!selectedTournamentId) {
        alert("Please select a tournament first.");
        return;
      }

      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${selectedTournamentId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ schoolId }), // ✅ correct payload
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add school to tournament");
      }

      alert(data.message); // ✅ shows “ABC Int’l school Aba successfully registered for testing”
    } catch (error) {
      console.error("Error adding school:", error);
      alert(error.message);
    }
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
                  Ekeremgba − Akpauche 2025
                  <i className="bi bi-chevron-down ms-2"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => setSelectedYear("")}
                    >
                      All Tournaments
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => setSelectedYear("2025")}
                    >
                      2025
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => setSelectedYear("2024")}
                    >
                      2024
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => setSelectedYear("2023")}
                    >
                      2023
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

          {/* Tournament List or Empty State */}
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
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar-fill text-danger me-2"></i>
                          <small>
                            {new Date(
                              tournament.created_at
                            ).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      {/* Action Buttons */}
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
                        {/* 🧩 Groupings button */}
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
                          Brackets
                        </button>

                        {/* 🏆 Leaderboard button */}
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
                      <div key={s.school_id} className={styles.schoolItem}>
                        <span className={styles.schoolName}>{s.name}</span>
                        <button
                          className={`${styles.addBtn} ${
                            selectedSchools.includes(s.school_id)
                              ? styles.addBtnActive
                              : ""
                          }`}
                          onClick={() => toggleSchoolSelection(s.school_id)}
                        >
                          {selectedSchools.includes(s.school_id)
                            ? "Added"
                            : "Add"}
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
                    {/* <button
                      onClick={async () => {
                        if (selectedSchools.length === 0)
                          return alert("No schools selected");
                        for (const id of selectedSchools) {
                          await handleAddSchoolsToTournament(id);
                        }
                        alert("All selected schools added successfully!");
                        setSelectedSchools([]); // optional reset
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
                    </button> */}

                    <button
                      onClick={async () => {
                        if (selectedSchools.length === 0) return;

                        let successCount = 0;
                        let failedSchools = [];

                        for (const id of selectedSchools) {
                          try {
                            const token = getAuthToken();
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
                            console.error("Failed to add school:", err.message);
                          }
                        }

                        // Show results using SweetAlert2
                        let htmlMsg = `<p><strong>${successCount}</strong> school(s) added successfully.</p>`;
                        if (failedSchools.length > 0) {
                          htmlMsg += `<p><strong>${failedSchools.length}</strong> school(s) failed to add.</p>`;
                        }

                        Swal.fire({
                          icon:
                            failedSchools.length === 0 ? "success" : "warning",
                          title: "Add Schools Result",
                          html: htmlMsg,
                        });

                        setSelectedSchools([]); // reset selection
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
                  onClick={() => setShowSchoolForm(false)}
                  className="btn-close"
                />
              </div>
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
                  <label className="form-label">Participants</label>
                  {schoolFormData.participants.map((p, i) => (
                    <div key={i} className="input-group mb-2">
                      <span className="input-group-text">{i + 1}</span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Fullname - ${i + 1}`}
                        value={p}
                        onChange={(e) =>
                          handleParticipantChange(i, e.target.value)
                        }
                        required
                      />
                      {schoolFormData.participants.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeParticipantField(i)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={addParticipantField}
                  >
                    <i className="bi bi-plus"></i> Add Participant
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
