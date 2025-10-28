"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function TournamentSchools() {
  const { id } = useParams();
  const router = useRouter();
  const [schoolsData, setSchoolsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [tournamentGenerated, setTournamentGenerated] = useState(false); // ✅ New flag

  // ✅ Helper to get auth token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ekereAuthToken");
    }
    return null;
  };

  // ✅ Fetch registered schools + tournament status
  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Missing authentication token");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${id}/registrations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load schools");

      setSchoolsData(data);

      // ✅ Detect if tournament is already generated
      if (data.tournament && data.tournament.isGenerated) {
        setTournamentGenerated(true);
      } else {
        setTournamentGenerated(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchSchools();
  }, [id, fetchSchools]);

  // ✅ Handle Generate Tournament
  const handleGenerateTournament = async () => {
    setGenerating(true);
    setError("");
    setSuccessMsg("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Missing authentication token");

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
      setTournamentGenerated(true); // ✅ mark as generated

      Swal.fire({
        icon: "success",
        title: "Tournament Generated!",
        text: data.message || "Matches successfully created.",
        confirmButtonColor: "#198754",
        timer: 2000,
        showConfirmButton: false,
      });

      await fetchSchools();

      setTimeout(() => {
        router.push(`/admin/dashboard/tournament/${id}/brackets`);
      }, 1000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to generate tournament.",
        confirmButtonColor: "#d33",
      });
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // ✅ Handle Delete School (only before tournament generation)
  const handleDeleteSchool = async (schoolId) => {
    if (tournamentGenerated) {
      Swal.fire({
        icon: "info",
        title: "Action Not Allowed",
        text: "You cannot delete schools after the tournament has been generated.",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the school from the tournament!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    setDeleting(schoolId);
    setError("");
    setSuccessMsg("");

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Missing authentication token");

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
        text: data.message || "School removed successfully.",
        confirmButtonColor: "#198754",
        timer: 2000,
        showConfirmButton: false,
      });

      await fetchSchools();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.message || "Failed to delete school.",
        confirmButtonColor: "#d33",
      });
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  // ✅ Render
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Schools in Tournament</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-success rounded-pill"
            onClick={handleGenerateTournament}
            disabled={generating || tournamentGenerated}
          >
            {generating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Generating...
              </>
            ) : tournamentGenerated ? (
              <>
                <i className="bi bi-check-circle me-2"></i> Tournament Generated
              </>
            ) : (
              <>
                <i className="bi bi-trophy me-2"></i> Generate Tournament
              </>
            )}
          </button>

          <button
            className="btn btn-outline-danger rounded-pill"
            onClick={() => router.back()}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger"></div>
          <p className="mt-3">Loading schools...</p>
        </div>
      )}

      {/* Schools Table */}
      {!loading && schoolsData && (
        <div className="card shadow-sm border-0 p-4">
          <h5 className="fw-bold mb-3">
            Tournament ID: {schoolsData.tournamentId}
          </h5>
          <p>
            <strong>Total Registered:</strong> {schoolsData.totalRegistered}
          </p>

          {tournamentGenerated && (
            <div className="alert alert-info mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Deleting schools is disabled because this tournament has already
              been generated.
            </div>
          )}

          {schoolsData.schools && schoolsData.schools.length > 0 ? (
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
                  {schoolsData.schools.map((school, index) => (
                    <tr key={school.id}>
                      <td>{index + 1}</td>
                      <td>{school.name}</td>
                      <td>{new Date(school.registered_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDeleteSchool(school.id)}
                          disabled={
                            deleting === school.id || tournamentGenerated
                          }
                        >
                          {deleting === school.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Deleting...
                            </>
                          ) : (
                            <>Remove</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted mt-3">
              No schools have registered for this tournament yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
