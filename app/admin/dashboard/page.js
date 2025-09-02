"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [tournamentData, setTournamentData] = useState({
    name: "",
    participants: "",
    groups: "",
    date: "",
    time: "",
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

  const [availableSchools, setAvailableSchools] = useState([]);
  const router = useRouter();

  // ✅ Get token from localStorage
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  };

  // ✅ Reset all form + modal state
  const resetAll = () => {
    setShowModal(false);
    setStep(1);
    setIsLoading(false);
    setSelectedSchools([]);
    setShowSchoolForm(false);
    setError("");
    setSuccess("");
    setTournamentData({
      name: "",
      participants: "",
      groups: "",
      date: "",
      time: "",
      location: "",
      description: "",
    });
    setSchoolFormData({
      name: "",
      address: "",
      phoneNumber: "",
      emailAddress: "",
      participants: [""],
    });
  };

  // ✅ Fetch schools
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
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

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

      // ✅ Map frontend fields to API fields
      const payload = {
        name: schoolFormData.name,
        address: schoolFormData.address,
        phone: schoolFormData.phoneNumber, // map correctly
        email: schoolFormData.emailAddress, // map correctly
        participants: schoolFormData.participants,
      };

      const res = await fetch(
        "https://api.ekeremgbaakpauche.com/api/school/register-school",
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

  // ✅ Create Tournament with correct token + payload
  const createTournament = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Missing auth token, please log in again.");
      router.push("/login"); // force login if token missing
      return;
    }

    const payload = {
      name: tournamentData.name,
      no_of_participants: `${tournamentData.participants} participants`,
      no_of_groups: `${tournamentData.groups} groups`,
      date: tournamentData.date,
      time: tournamentData.time,
      location: tournamentData.location,
      description: tournamentData.description,
      schools: selectedSchools.map((id) => {
        const s = availableSchools.find((sch) => sch.school_id === id);
        return {
          name: s.name,
          address: s.address,
        };
      }),
    };

    try {
      const res = await fetch(
        "https://api.ekeremgbaakpauche.com/api/admin/create-tournament",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ send token
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok && data.status) {
        setSuccess("Tournament created successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard/tournament");
          resetAll();
        }, 1500);
      } else {
        throw new Error(data.message || "Create failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error creating tournament");
    }
  };

  const handleFinal = () => {
    setIsLoading(true);
    createTournament();
  };

  return (
    <>
      <div className="row">
        {/* Existing UI (header, modal, tournament steps)... */}
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
                    <a className="dropdown-item" href="#">
                      Ekeremgba − Akpauche 2025
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

          {/* Empty state */}
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
        {showModal && (
          <div className={styles.modalOverlay}>
            <div
              className={`${styles.modalPanel} ${
                step === 2 ? styles.modalPanelWide : ""
              }`}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold">Tournament</h5>
                <button onClick={resetAll} className="btn-close" />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

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
                      value={tournamentData.name}
                      onChange={(e) =>
                        handleTournamentDataChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <label className="form-label">
                        Number of participants
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select shadow-none"
                        value={tournamentData.participants}
                        onChange={(e) =>
                          handleTournamentDataChange(
                            "participants",
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="8">8 participants</option>
                        <option value="16">16 participants</option>
                        <option value="32">32 participants</option>
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label">
                        Number of groups<span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select shadow-none"
                        value={tournamentData.groups}
                        onChange={(e) =>
                          handleTournamentDataChange("groups", e.target.value)
                        }
                        required
                      >
                        <option value="">Select</option>
                        <option value="2">2 groups</option>
                        <option value="4">4 groups</option>
                        <option value="8">8 groups</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={tournamentData.date}
                        onChange={(e) =>
                          handleTournamentDataChange("date", e.target.value)
                        }
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={tournamentData.time}
                        onChange={(e) =>
                          handleTournamentDataChange("time", e.target.value)
                        }
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
                      Continue
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && !isLoading && (
                <div className={styles.addSchoolsContainer}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className="fw-bold mb-0">Add Schools</h6>
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
                      <i className="bi bi-plus"></i> Add School
                    </button>
                  </div>

                  <div className="mt-4 d-flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="btn btn-outline-secondary"
                      style={{ borderRadius: "30px" }}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleFinal}
                      className="btn flex-grow-1"
                      style={{
                        background:
                          "linear-gradient(to right, #b30000, #660000)",
                        color: "#fff",
                        borderRadius: "30px",
                      }}
                      disabled={selectedSchools.length === 0}
                    >
                      Create Tournament ({selectedSchools.length} schools
                      selected)
                    </button>
                  </div>
                </div>
              )}

              {isLoading && (
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
        ;{/* Add School Modal */}
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
                {/* School input fields */}
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

                {/* Dynamic Participants */}
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
