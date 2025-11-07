"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import styles from "./fixtures.module.css";

export default function FixturesPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2025");

  // Bracket states
  const [bracketData, setBracketData] = useState(null);
  const [bracketLoading, setBracketLoading] = useState(false);
  const [bracketError, setBracketError] = useState("");
  const [champion, setChampion] = useState(null);

  // View Schools Modal states
  const [showSchoolsModal, setShowSchoolsModal] = useState(false);
  const [selectedTournamentForSchools, setSelectedTournamentForSchools] =
    useState(null);
  const [schoolsData, setSchoolsData] = useState(null);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError] = useState("");

  // Leaderboard Modal states
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [
    selectedTournamentForLeaderboard,
    setSelectedTournamentForLeaderboard,
  ] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState("");

  const router = useRouter();

  const getAuthToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("ekereAuthToken")
      : null;

  // ✅ Fetch tournaments with year filter
  useEffect(() => {
    async function fetchTournaments() {
      setLoading(true);
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
          setError("Failed to fetch tournaments");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchTournaments();
  }, [selectedYear]);

  // ✅ Fetch bracket for selected tournament
  const fetchBracket = useCallback(async (tournamentId) => {
    setBracketLoading(true);
    setBracketError("");
    try {
      const token = getAuthToken();
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/bracket/${tournamentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data?.bracket) {
        setBracketData(data.bracket);
      } else setBracketError("No bracket data found.");
      const champRes = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/champion?tournamentId=${tournamentId}`
      );
      const champData = await champRes.json();
      if (champData?.champion) setChampion(champData.champion);
      else setChampion(null);
    } catch {
      setBracketError("Failed to load bracket data.");
    } finally {
      setBracketLoading(false);
    }
  }, []);

  // ✅ Fetch schools for selected tournament
  const fetchSchoolsForTournament = useCallback(async (tournamentId) => {
    setSchoolsLoading(true);
    setSchoolsError("");
    try {
      const token = getAuthToken();
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${tournamentId}/registrations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load schools");

      setSchoolsData({
        tournamentId: data.tournamentId || tournamentId,
        totalRegistered: data.totalRegistered || data.schools?.length || 0,
        schools: data.schools || [],
      });
    } catch (err) {
      setSchoolsError(err.message);
    } finally {
      setSchoolsLoading(false);
    }
  }, []);

  // ✅ Fetch leaderboard for selected tournament
  const fetchLeaderboard = useCallback(async (tournamentId) => {
    setLeaderboardLoading(true);
    setLeaderboardError("");
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Missing authentication token");

      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/leaderboard?tournamentId=${tournamentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load leaderboard");

      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setLeaderboardError(err.message);
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  // ✅ Auto-refresh leaderboard when modal is open
  useEffect(() => {
    if (!showLeaderboardModal || !selectedTournamentForLeaderboard) return;

    const interval = setInterval(() => {
      fetchLeaderboard(selectedTournamentForLeaderboard.id);
    }, 10000);

    return () => clearInterval(interval);
  }, [
    showLeaderboardModal,
    selectedTournamentForLeaderboard,
    fetchLeaderboard,
  ]);

  const openModal = (t) => {
    setSelectedTournament(t);
    fetchBracket(t.id);
  };

  const closeModal = () => {
    setSelectedTournament(null);
    setBracketData(null);
    setChampion(null);
  };

  const openSchoolsModal = (tournament) => {
    setSelectedTournamentForSchools(tournament);
    setShowSchoolsModal(true);
    fetchSchoolsForTournament(tournament.id);
  };

  const closeSchoolsModal = () => {
    setShowSchoolsModal(false);
    setSelectedTournamentForSchools(null);
    setSchoolsData(null);
    setSchoolsError("");
  };

  const openLeaderboardModal = (tournament) => {
    setSelectedTournamentForLeaderboard(tournament);
    setShowLeaderboardModal(true);
    fetchLeaderboard(tournament.id);
  };

  const closeLeaderboardModal = () => {
    setShowLeaderboardModal(false);
    setSelectedTournamentForLeaderboard(null);
    setLeaderboard([]);
    setLeaderboardError("");
  };

  // ✅ Get display text for dropdown
  const getDropdownText = () => {
    if (!selectedYear) return "All Tournaments";
    return `Ekeremgba − Akpauche ${selectedYear}`;
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* ✅ Added Tournament Selector Dropdown */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Tournament Fixtures</h2>

          <div
            className="dropdown p-2"
            style={{
              border: "2px solid #f2f2f2",
              borderRadius: "15px",
              backgroundColor: "#fff",
            }}
          >
            <button
              className="btn d-flex align-items-center gap-2"
              type="button"
              data-bs-toggle="dropdown"
              style={{
                border: "none",
                background: "transparent",
                fontWeight: "500",
              }}
            >
              {getDropdownText()}
              <i className="bi bi-chevron-down"></i>
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

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" />
            <p>Loading tournaments...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="mx-auto mb-4"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="bi bi-trophy text-muted"
                style={{ fontSize: "4rem" }}
              ></i>
            </div>
            <h4 className="text-muted fw-bold mb-2">No Tournaments Found</h4>
            <p className="text-muted">
              {selectedYear
                ? `No tournaments found for ${selectedYear}`
                : "No tournaments available at the moment"}
            </p>
          </div>
        ) : (
          <div className="row mt-5 justify-content-center">
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
                          {new Date(tournament.created_at).toLocaleDateString()}
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
                        onClick={() => openSchoolsModal(tournament)}
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Schools
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger flex-grow-1"
                        style={{
                          borderRadius: "20px",
                        }}
                        onClick={() => openModal(tournament)}
                      >
                        <i className="bi bi-diagram-3-fill me-1"></i>
                        Groups
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger flex-grow-1"
                        style={{
                          borderRadius: "20px",
                        }}
                        onClick={() => openLeaderboardModal(tournament)}
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

        {/* 🏫 View Schools Modal */}
        {showSchoolsModal && (
          <div className={styles.modalBackdrop} onClick={closeSchoolsModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-danger mb-0">
                  Schools - {selectedTournamentForSchools?.name} (
                  {selectedTournamentForSchools?.year})
                </h5>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={closeSchoolsModal}
                >
                  ✕
                </button>
              </div>

              {schoolsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger"></div>
                  <p className="mt-3">Loading schools...</p>
                </div>
              ) : schoolsError ? (
                <div className="alert alert-danger text-center">
                  {schoolsError}
                </div>
              ) : schoolsData?.schools?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "60px" }}>#</th>
                        <th>School Name</th>
                        <th>Registered At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schoolsData.schools.map((school, index) => (
                        <tr key={school.id}>
                          <td className="text-center fw-semibold">
                            {index + 1}
                          </td>
                          <td className="fw-semibold">{school.name}</td>
                          <td className="text-muted">
                            {new Date(school.registered_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 text-center text-muted">
                    <strong>Total Registered:</strong>{" "}
                    {schoolsData.totalRegistered} school(s)
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div
                    className="mx-auto mb-4"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="bi bi-building text-muted"
                      style={{ fontSize: "4rem" }}
                    ></i>
                  </div>
                  <h4 className="text-muted fw-bold mb-2">
                    No Schools Registered
                  </h4>
                  <p className="text-muted">
                    No schools have registered for this tournament yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📊 Leaderboard Modal */}
        {showLeaderboardModal && (
          <div className={styles.modalBackdrop} onClick={closeLeaderboardModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-danger mb-0">
                  Leaderboard - {selectedTournamentForLeaderboard?.name} (
                  {selectedTournamentForLeaderboard?.year})
                </h5>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={closeLeaderboardModal}
                >
                  ✕
                </button>
              </div>

              {leaderboardLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-danger"></div>
                  <p className="mt-3">Loading leaderboard...</p>
                </div>
              ) : leaderboardError ? (
                <div className="alert alert-danger text-center">
                  {leaderboardError}
                </div>
              ) : leaderboard.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle text-center">
                      <thead className="table-primary">
                        <tr>
                          <th>#</th>
                          <th>School</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((item, index) => (
                          <tr key={index}>
                            <td className="fw-semibold">{index + 1}</td>
                            <td className="fw-semibold">{item.school}</td>
                            <td>{item.progress}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted small text-end mb-0 mt-2">
                    Auto-refreshing every 10 seconds 🔄
                  </p>
                </>
              ) : (
                <div className="text-center py-5">
                  <div
                    className="mx-auto mb-4"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="bi bi-bar-chart text-muted"
                      style={{ fontSize: "4rem" }}
                    ></i>
                  </div>
                  <h4 className="text-muted fw-bold mb-2">
                    No Leaderboard Data
                  </h4>
                  <p className="text-muted">
                    No leaderboard data found for this tournament.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🏆 Brackets Modal */}
        {selectedTournament && (
          <div className={styles.modalBackdrop} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-bold text-danger">
                  {selectedTournament.name} ({selectedTournament.year})
                </h5>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </div>

              {bracketLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-danger"></div>
                  <p>Loading groups...</p>
                </div>
              ) : bracketError ? (
                <div className="alert alert-warning text-center">
                  {bracketError}
                </div>
              ) : !bracketData || Object.keys(bracketData).length === 0 ? (
                <div className="text-center py-5">
                  <div
                    className="mx-auto mb-4"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className="bi bi-diagram-3 text-muted"
                      style={{ fontSize: "4rem" }}
                    ></i>
                  </div>
                  <h4 className="text-muted fw-bold mb-2">
                    No School Groups Available
                  </h4>
                  <p className="text-muted">
                    The tournament groups hasn&apos;t been created yet.
                    <br />
                    Please check back later for updates.
                  </p>
                </div>
              ) : (
                bracketData && (
                  <div
                    style={{
                      padding: "1rem",
                      maxHeight: "70vh",
                      overflowY: "auto",
                    }}
                  >
                    {/* Champion Banner */}
                    {champion && (
                      <div
                        className="text-center p-4 rounded-4 mb-4 shadow mx-auto"
                        style={{
                          maxWidth: "700px",
                          background:
                            "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                          border: "3px solid #f0c000",
                        }}
                      >
                        <i
                          className="bi bi-trophy-fill text-warning mb-2"
                          style={{ fontSize: "3rem" }}
                        ></i>
                        <h2 className="fw-bold text-dark mb-1">🏆 Champion</h2>
                        <h3 className="text-dark fw-bold">{champion}</h3>
                      </div>
                    )}

                    {/* Bracket Rounds */}
                    <div className="row g-4">
                      {Object.keys(bracketData).map((round, roundIndex) => (
                        <div key={round} className="col-12">
                          {/* Round Header */}
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div
                              className="px-3 py-2 rounded-3 shadow d-inline-flex align-items-center gap-2"
                              style={{
                                background:
                                  "linear-gradient(#c71d12 0%, #680b05 100%)",
                                color: "white",
                              }}
                            >
                              <span className="fw-bold">{round}</span>
                            </div>
                            {roundIndex <
                              Object.keys(bracketData).length - 1 && (
                              <i
                                className="bi bi-chevron-right text-muted"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            )}
                          </div>

                          {/* Matches Grid */}
                          <div className="row g-3">
                            {bracketData[round].map((match) => {
                              const isUpcoming = !match.winner;

                              return (
                                <div
                                  key={match.match_id}
                                  className="col-12 col-md-6 col-lg-4"
                                >
                                  <div
                                    className="card h-100 shadow-sm border-0"
                                    style={{
                                      borderLeft: isUpcoming
                                        ? "4px solid #ffc107"
                                        : "4px solid #6c757d",
                                      transition: "transform 0.2s",
                                    }}
                                  >
                                    <div className="card-body">
                                      {/* Match Header */}
                                      <div className="d-flex justify-content-between align-items-center mb-3">
                                        <small className="text-muted fw-semibold">
                                          Match {match.match_id}
                                        </small>
                                        {match.match_time && (
                                          <div className="d-flex align-items-center gap-1 text-danger small">
                                            <i
                                              className="bi bi-clock-fill"
                                              style={{ fontSize: "0.875rem" }}
                                            ></i>
                                            <span>{match.match_time}</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Team 1 */}
                                      <div
                                        className="d-flex justify-content-between align-items-center py-2 px-3 mb-2 rounded"
                                        style={{ background: "#f8f9fa" }}
                                      >
                                        <span className="fw-semibold text-dark">
                                          {match.school1}
                                        </span>
                                        <span
                                          className="fw-bold"
                                          style={{
                                            minWidth: "20px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {match.school1_score !== undefined
                                            ? match.school1_score
                                            : "-"}
                                        </span>
                                      </div>

                                      {/* VS Divider */}
                                      <div className="text-center text-muted small fw-semibold my-2">
                                        VS
                                      </div>

                                      {/* Team 2 */}
                                      <div
                                        className="d-flex justify-content-between align-items-center py-2 px-3 mb-3 rounded"
                                        style={{ background: "#f8f9fa" }}
                                      >
                                        <span className="fw-semibold text-dark">
                                          {match.school2}
                                        </span>
                                        <span
                                          className="fw-bold"
                                          style={{
                                            minWidth: "20px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {match.school2_score !== undefined
                                            ? match.school2_score
                                            : "-"}
                                        </span>
                                      </div>

                                      {/* Winner Display */}
                                      {match.winner && (
                                        <div
                                          className="alert alert-success mb-0 py-2"
                                          role="alert"
                                        >
                                          <strong>Winner:</strong>{" "}
                                          {match.winner}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
