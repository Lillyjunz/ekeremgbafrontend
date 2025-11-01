"use client";

import { useCallback, useEffect, useState } from "react";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import styles from "./fixtures.module.css";

export default function FixturesPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Bracket states
  const [bracketData, setBracketData] = useState(null);
  const [bracketLoading, setBracketLoading] = useState(false);
  const [bracketError, setBracketError] = useState("");
  const [champion, setChampion] = useState(null);

  const getAuthToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("ekereAuthToken")
      : null;

  // ✅ Fetch tournaments
  useEffect(() => {
    async function fetchTournaments() {
      try {
        const token = getAuthToken();
        const res = await fetch(
          "https://api.ekeremgbaakpauche.com/api/admin/tournaments",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setTournaments(data);
        else setError("Failed to fetch tournaments");
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchTournaments();
  }, []);

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

  const openModal = (t) => {
    setSelectedTournament(t);
    fetchBracket(t.id);
  };

  const closeModal = () => {
    setSelectedTournament(null);
    setBracketData(null);
    setChampion(null);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className="text-center fw-bold mt-4">Tournament Fixtures</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" />
            <p>Loading tournaments...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
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

                    {/* Brackets Button */}
                    <div className="mt-3">
                      <button
                        className="btn w-100"
                        style={{
                          background:
                            "linear-gradient(to right, #b30000, #660000)",
                          color: "#fff",
                          borderRadius: "20px",
                        }}
                        onClick={() => openModal(tournament)}
                      >
                        <i className="bi bi-diagram-3-fill me-2"></i>
                        View Brackets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🏆 Modal */}
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
                  <p>Loading bracket...</p>
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
                    No Bracket Available
                  </h4>
                  <p className="text-muted">
                    The tournament bracket hasn't been created yet.
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
