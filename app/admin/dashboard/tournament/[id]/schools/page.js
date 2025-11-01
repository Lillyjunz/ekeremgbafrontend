"use client";

import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import styles from "./schools.module.css";

export default function TournamentSchools() {
  const { id } = useParams();
  const router = useRouter();

  // State
  const [token, setToken] = useState(null);
  const [schoolsData, setSchoolsData] = useState(null);
  const [tournamentInfo, setTournamentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [tournamentGenerated, setTournamentGenerated] = useState(false);

  // Modal states
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [allSchools, setAllSchools] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [showSchoolForm, setShowSchoolForm] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  // ✅ School form state
  const [schoolFormData, setSchoolFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    emailAddress: "",
    participants: ["", "", ""],
  });

  // ✅ Get token safely on client
  useEffect(() => {
    const t = Cookies.get("ekereAuthToken");
    if (!t) {
      Swal.fire("Unauthorized", "Please login again", "error");
      router.push("/admin");
      return;
    }
    setToken(t);
  }, [router]);

  // ✅ Fetch tournament details
  const fetchTournamentName = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(
        "https://api.ekeremgbaakpauche.com/api/admin/tournaments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to fetch tournaments");

      const tournament = data.find((t) => t.id.toString() === id.toString());
      setTournamentInfo(tournament || null);
    } catch (err) {
      console.error(err.message);
    }
  }, [id, token]);

  // ✅ Fetch schools in this tournament
  const fetchSchools = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${id}/registrations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load schools");

      setSchoolsData({
        tournamentId: data.tournamentId || id,
        totalRegistered: data.totalRegistered || data.schools?.length || 0,
        schools: data.schools || [],
      });

      setTournamentGenerated(
        data.message?.includes("Round of 32 generated") || false
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (id && token) {
      fetchTournamentName();
      fetchSchools();
    }
  }, [id, token, fetchTournamentName, fetchSchools]);

  // ✅ Generate Tournament
  const handleGenerateTournament = async () => {
    if (!token) return;
    setGenerating(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/generate-tournament/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to generate tournament");

      setSuccessMsg(data.message);
      setTournamentGenerated(true);

      Swal.fire({
        icon: "success",
        title: "Tournament Generated!",
        text: data.message || "Matches successfully created.",
        timer: 2000,
        showConfirmButton: false,
      });

      await fetchSchools();
      setTimeout(
        () => router.push(`/admin/dashboard/tournament/${id}/brackets`),
        1000
      );
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error!", text: err.message || "" });
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // ✅ Delete School
  const handleDeleteSchool = async (schoolId) => {
    if (!token) return;
    if (tournamentGenerated) {
      Swal.fire({
        icon: "info",
        title: "Action Not Allowed",
        text: "You cannot delete schools after the tournament has been generated.",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the school from the tournament!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setDeleting(schoolId);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${id}/school/${schoolId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete school");

      setSuccessMsg(data.message);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: data.message,
        timer: 2000,
        showConfirmButton: false,
      });
      await fetchSchools();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error!", text: err.message || "" });
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  // ✅ Fetch all schools for modal

  const fetchAllSchools = useCallback(async () => {
    if (!token) return;
    setModalLoading(true);
    try {
      const res = await fetch(
        "https://api.ekeremgbaakpauche.com/api/school/get-schools"
      );
      const data = await res.json();
      if (!data.schools?.allSchools)
        throw new Error("Invalid schools response");

      const schools = data.schools.allSchools.map((s) => ({
        id: s.id,
        name: s.name,
        address: s.address,
        phoneNumber: s.phone,
        emailAddress: s.email,
        students: s.students || [],
      }));

      setAllSchools(schools);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to fetch schools", "error");
    } finally {
      setModalLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (showSchoolModal && token) {
      fetchAllSchools();
      setSelectedSchools([]);
    }
  }, [showSchoolModal, token, fetchAllSchools]);

  // ✅ Modal helpers

  const toggleSchoolSelection = (id) => {
    setSelectedSchools((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const addAll = () => setSelectedSchools(allSchools.map((s) => s.id));
  const removeAll = () => setSelectedSchools([]);

  const resetSchoolModal = () => {
    setSelectedSchools([]);
    setShowSchoolModal(false);
    setShowSchoolForm(false);
    setModalError("");
    setModalSuccess("");
    setSchoolFormData({
      name: "",
      address: "",
      phoneNumber: "",
      emailAddress: "",
      participants: ["", "", ""],
    });
  };

  // ✅ School form handlers
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
      setModalError("Minimum 3 participants required");
      setTimeout(() => setModalError(""), 3000);
      return;
    }
    const updated = schoolFormData.participants.filter((_, i) => i !== index);
    setSchoolFormData((prev) => ({ ...prev, participants: updated }));
  };

  // ✅ Submit new school
  const handleSchoolFormSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (schoolFormData.participants.length < 3) {
      setModalError("Please add at least 3 participants");
      return;
    }

    const validParticipants = schoolFormData.participants.filter(
      (p) => p.trim() !== ""
    );
    if (validParticipants.length < 3) {
      setModalError("Please fill in at least 3 participant names");
      return;
    }

    const uniqueNames = new Set(
      validParticipants.map((p) => p.trim().toLowerCase())
    );
    if (uniqueNames.size < validParticipants.length) {
      setModalError("Participant names must be unique");
      return;
    }

    try {
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

        setAllSchools((prev) => [...prev, newSchool]);
        setSelectedSchools((prev) => [...prev, newSchool.id]);

        setModalSuccess("School added successfully!");

        await fetchAllSchools();

        setShowSchoolForm(false);

        setSchoolFormData({
          name: "",
          address: "",
          phoneNumber: "",
          emailAddress: "",
          participants: ["", "", ""],
        });

        setTimeout(() => setModalSuccess(""), 3000);
      } else {
        throw new Error(data.message || "Add school failed");
      }
    } catch (err) {
      console.error(err);
      setModalError(err.message || "Error adding school");
    }
  };

  // ✅ Add selected schools to tournament

  const handleAddSchools = async () => {
    if (selectedSchools.length === 0) return;

    setModalSubmitting(true);
    let successCount = 0;
    let failedSchools = [];

    for (const schoolId of selectedSchools) {
      try {
        const res = await fetch(
          `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${id}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            // ✅ Send only numeric id
            body: JSON.stringify({ schoolId }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed");
        successCount++;
      } catch (err) {
        failedSchools.push(schoolId);
        console.error(`Failed to add school ${schoolId}:`, err.message);
      }
    }

    let htmlMsg = `<p><strong>${successCount}</strong> school(s) added successfully.</p>`;
    if (failedSchools.length > 0) {
      htmlMsg += `<p><strong>${failedSchools.length}</strong> school(s) failed to add.</p>`;
    }

    Swal.fire({
      icon: failedSchools.length === 0 ? "success" : "warning",
      title: "Add Schools Result",
      html: htmlMsg,
    });

    resetSchoolModal();
    fetchSchools();
    setModalSubmitting(false);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Schools in Tournament</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary rounded-pill"
            onClick={() => setShowSchoolModal(true)}
            disabled={tournamentGenerated}
          >
            <i className="bi bi-plus-circle me-2"></i> Add School
          </button>
          <button
            className="btn btn-success rounded-pill"
            onClick={handleGenerateTournament}
            disabled={generating || tournamentGenerated}
          >
            {generating ? (
              <>Generating...</>
            ) : tournamentGenerated ? (
              <>Tournament Generated</>
            ) : (
              <>Generate Tournament</>
            )}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>
          <p className="mt-3">Loading schools...</p>
        </div>
      ) : (
        <div className="card p-4 shadow-sm border-0">
          <h5>
            Tournament: {tournamentInfo?.name} ({tournamentInfo?.year})
          </h5>
          <p>
            <strong>Total Registered:</strong> {schoolsData?.totalRegistered}
          </p>

          {schoolsData?.schools.length > 0 ? (
            <div className="table-responsive mt-3">
              <table className="table table-bordered align-middle">
                <thead className="table-danger">
                  <tr>
                    <th>#</th>
                    <th>School Name</th>
                    <th>Registered At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolsData.schools.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td>{s.name}</td>
                      <td>{new Date(s.registered_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteSchool(s.id)}
                          disabled={deleting === s.id || tournamentGenerated}
                        >
                          {deleting === s.id ? <>Deleting...</> : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No schools registered yet.</p>
          )}
        </div>
      )}

      {/* Add School Modal */}
      {showSchoolModal && !showSchoolForm && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalPanel} ${styles.modalPanelWide}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold">Add Schools to Tournament</h5>
              <button onClick={resetSchoolModal} className="btn-close" />
            </div>
            {modalError && (
              <div className="alert alert-danger">{modalError}</div>
            )}
            {modalSuccess && (
              <div className="alert alert-success">{modalSuccess}</div>
            )}

            {!modalLoading ? (
              <div className={styles.addSchoolsContainer}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0">Select Schools</h6>
                  <button
                    className={styles.addAllBtn}
                    onClick={
                      selectedSchools.length === allSchools.length
                        ? removeAll
                        : addAll
                    }
                  >
                    {selectedSchools.length === allSchools.length
                      ? "Remove All"
                      : "Add All"}
                  </button>
                </div>

                <div className={styles.schoolsList}>
                  {allSchools.map((s) => (
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
                    onClick={handleAddSchools}
                    className="btn w-100"
                    style={{
                      background: "linear-gradient(to right, #b30000, #660000)",
                      color: "#fff",
                      borderRadius: "30px",
                    }}
                    disabled={selectedSchools.length === 0 || modalSubmitting}
                  >
                    {modalSubmitting
                      ? "Adding..."
                      : `Add Schools to Tournament (${selectedSchools.length} selected)`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-danger"
                  style={{ width: "3rem", height: "3rem" }}
                />
                <p className="mt-3">Loading schools...</p>
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
                  setModalError("");
                }}
                className="btn-close"
              />
            </div>
            {modalError && (
              <div className="alert alert-danger">{modalError}</div>
            )}
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

              {/* Participants Section */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  Participants{" "}
                  <span className="text-muted small">(Minimum 3 required)</span>
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
  );
}
