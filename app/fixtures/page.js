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
  const [selectedYear, setSelectedYear] = useState("2026");

  const [bracketData, setBracketData] = useState(null);
  const [bracketLoading, setBracketLoading] = useState(false);
  const [bracketError, setBracketError] = useState("");
  const [champion, setChampion] = useState(null);

  const [showSchoolsModal, setShowSchoolsModal] = useState(false);
  const [selectedTournamentForSchools, setSelectedTournamentForSchools] =
    useState(null);
  const [schoolsData, setSchoolsData] = useState(null);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError] = useState("");

  const [showChampionModal, setShowChampionModal] = useState(false);
  const [selectedTournamentForChampion, setSelectedTournamentForChampion] =
    useState(null);
  const [championData, setChampionData] = useState(null);
  const [championLoading, setChampionLoading] = useState(false);
  const [championError, setChampionError] = useState("");

  const [showBracketModal, setShowBracketModal] = useState(false);

  const router = useRouter();

  const getAuthToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("ekereAuthToken")
      : null;

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getChampionFromBracket = (bracket) => {
    if (!bracket) return null;

    const rounds = Object.keys(bracket);
    if (rounds.length === 0) return null;

    const lastRoundName = rounds[rounds.length - 1];
    const lastRoundMatches = bracket[lastRoundName];

    if (!lastRoundMatches || lastRoundMatches.length !== 1) {
      return null;
    }

    const finalMatch = lastRoundMatches[0];
    return finalMatch.winner || null;
  };

  useEffect(() => {
    async function fetchTournaments() {
      setLoading(true);
      try {
        const url = selectedYear
          ? `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${selectedYear}`
          : "https://api.ekeremgbaakpauche.com/api/admin/tournaments";

        const res = await fetch(url);
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

  const fetchBracket = useCallback(async (tournamentId) => {
    setBracketLoading(true);
    setBracketError("");

    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/bracket/${tournamentId}`
      );
      const data = await res.json();

      if (data?.bracket) {
        setBracketData(data.bracket);
      } else {
        setBracketError("No bracket data found.");
      }

      const champRes = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/champion?tournamentId=${tournamentId}`
      );
      const champData = await champRes.json();

      if (champData?.champion) {
        setChampion(champData.champion);
      } else {
        setChampion(null);
      }
    } catch {
      setBracketError("Failed to load bracket data.");
    } finally {
      setBracketLoading(false);
    }
  }, []);

  const fetchSchoolsForTournament = useCallback(async (tournamentId) => {
    setSchoolsLoading(true);
    setSchoolsError("");

    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/tournaments/${tournamentId}/registrations`
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

  const fetchChampion = useCallback(async (tournamentId) => {
    setChampionLoading(true);
    setChampionError("");
    setChampionData(null);

    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/bracket/${tournamentId}`
      );
      const data = await res.json();

      if (data?.bracket && Object.keys(data.bracket).length > 0) {
        const champion = getChampionFromBracket(data.bracket);
        setChampionData({
          champion: champion,
          hasBracket: true,
        });
      } else {
        setChampionData({
          champion: null,
          hasBracket: false,
        });
      }
    } catch (err) {
      console.error(err);
      setChampionError("Failed to load champion data");
    } finally {
      setChampionLoading(false);
    }
  }, []);

  const openBracketModal = (t) => {
    setSelectedTournament(t);
    setShowBracketModal(true);
    fetchBracket(t.id);
  };

  const closeBracketModal = () => {
    setShowBracketModal(false);
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

  const openChampionModal = (tournament) => {
    setSelectedTournamentForChampion(tournament);
    setShowChampionModal(true);
    fetchChampion(tournament.id);
  };

  const closeChampionModal = () => {
    setShowChampionModal(false);
    setSelectedTournamentForChampion(null);
    setChampionData(null);
    setChampionError("");
  };

  const getDropdownText = () => {
    if (!selectedYear) return "All Tournaments";
    return `Ekeremgba − Akpauche ${selectedYear}`;
  };

  const formatEventDate = (date) => {
    if (!date) return null;
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return String(date).trim();
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
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
          <div className="row mt-5">
            {tournaments.map((tournament) => {
              const eventDate = tournament.event_date
                ? formatEventDate(tournament.event_date)
                : null;

              return (
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

                        {eventDate && (
                          <div className="d-flex align-items-center">
                            <i className="bi bi-calendar-fill text-danger me-2"></i>
                            <small>{eventDate}</small>
                          </div>
                        )}
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
                          onClick={() => openSchoolsModal(tournament)}
                        >
                          <i className="bi bi-eye me-1"></i>
                          View Schools
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          style={{ borderRadius: "20px" }}
                          onClick={() => openBracketModal(tournament)}
                        >
                          <i className="bi bi-diagram-3-fill me-1"></i>
                          Groups
                        </button>

                        <button
                          className="btn btn-sm btn-outline-success flex-grow-1"
                          style={{ borderRadius: "20px" }}
                          onClick={() => openChampionModal(tournament)}
                        >
                          <i className="bi bi-trophy-fill me-1"></i>
                          View Champion
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schools Modal */}
      {showSchoolsModal && (
        <div className={styles.modalBackdrop} onClick={closeSchoolsModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-building me-2 text-danger"></i>
                Schools Registered
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeSchoolsModal}
              ></button>
            </div>

            {schoolsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger"></div>
                <p className="mt-3">Loading schools...</p>
              </div>
            ) : schoolsError ? (
              <div className="alert alert-danger">{schoolsError}</div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-light rounded">
                  <h6 className="mb-2">
                    <strong>Tournament:</strong>{" "}
                    {capitalizeWords(selectedTournamentForSchools?.name)} (
                    {selectedTournamentForSchools?.year})
                  </h6>
                  <p className="mb-0">
                    <strong>Total Registered:</strong>{" "}
                    {schoolsData?.totalRegistered || 0}
                  </p>
                </div>

                {schoolsData?.schools && schoolsData.schools.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-danger">
                        <tr>
                          <th>#</th>
                          <th>School Name</th>
                          <th>Registered At</th>
                        </tr>
                      </thead>

                      <tbody>
                        {schoolsData.schools.map((s, i) => (
                          <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{capitalizeWords(s.name)}</td>
                            <td>
                              {new Date(s.registered_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i
                      className="bi bi-inbox text-muted"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <p className="text-muted mt-2">
                      No schools registered yet.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Bracket Modal */}
      {showBracketModal && (
        <div className={styles.modalBackdrop} onClick={closeBracketModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "1200px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-trophy me-2 text-warning"></i>
                Tournament Groups
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeBracketModal}
              ></button>
            </div>

            {bracketLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger"></div>
                <p className="mt-3">Loading bracket...</p>
              </div>
            ) : bracketError ? (
              <div className="alert alert-danger">{bracketError}</div>
            ) : !bracketData || Object.keys(bracketData).length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="bi bi-trophy text-muted"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h5 className="text-muted mt-3">No Bracket Available</h5>
                <p className="text-muted">
                  The tournament bracket hasn&apos;t been created yet.
                </p>
              </div>
            ) : (
              <>
                {champion && (
                  <div
                    className="text-center p-4 rounded-4 mb-4 shadow"
                    style={{
                      background:
                        "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                      border: "3px solid #f0c000",
                    }}
                  >
                    <i
                      className="bi bi-award-fill text-warning"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <h3 className="fw-bold text-dark mb-1 mt-2">🏆 Champion</h3>
                    <h4 className="text-dark fw-bold">
                      {capitalizeWords(champion)}
                    </h4>
                  </div>
                )}

                {Object.keys(bracketData).map((round, roundIndex) => (
                  <div key={round} className="mb-4">
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
                    </div>

                    <div className="row g-3">
                      {bracketData[round].map((match, matchIndex) => (
                        <div
                          key={match.match_id}
                          className="col-12 col-md-6 col-lg-4"
                        >
                          <div
                            className="card shadow-sm border-0 h-100"
                            style={{
                              borderLeft: match.winner
                                ? "4px solid #28a745"
                                : "4px solid #ffc107",
                            }}
                          >
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <small className="text-muted fw-semibold">
                                  Match {matchIndex + 1}
                                </small>

                                {match.match_time && (
                                  <div className="d-flex align-items-center gap-1 text-danger small">
                                    <i className="bi bi-clock"></i>
                                    <span>{match.match_time}</span>
                                  </div>
                                )}
                              </div>

                              <div
                                className="d-flex justify-content-between align-items-center py-2 px-3 mb-2 rounded"
                                style={{ background: "#f8f9fa" }}
                              >
                                <span className="fw-semibold text-dark d-flex align-items-center gap-2">
                                  <span
                                    className="badge bg-primary"
                                    style={{
                                      fontSize: "0.75rem",
                                      minWidth: "35px",
                                    }}
                                  >
                                    {match.school1Id}
                                  </span>
                                  {capitalizeWords(match.school1)}
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

                              <div className="text-center text-muted small fw-semibold my-2">
                                VS
                              </div>

                              <div
                                className="d-flex justify-content-between align-items-center py-2 px-3 mb-3 rounded"
                                style={{ background: "#f8f9fa" }}
                              >
                                <span className="fw-semibold text-dark d-flex align-items-center gap-2">
                                  <span
                                    className="badge bg-primary"
                                    style={{
                                      fontSize: "0.75rem",
                                      minWidth: "35px",
                                    }}
                                  >
                                    {match.school2Id}
                                  </span>
                                  {capitalizeWords(match.school2)}
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

                              {match.winner ? (
                                <div
                                  className="alert alert-success mb-0 py-2"
                                  role="alert"
                                >
                                  <i className="bi bi-trophy-fill me-2"></i>
                                  <strong>Winner:</strong>{" "}
                                  {capitalizeWords(match.winner)}
                                </div>
                              ) : (
                                <div
                                  className="alert alert-warning mb-0 py-2"
                                  role="alert"
                                >
                                  <i className="bi bi-hourglass-split me-2"></i>
                                  Match Pending
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Champion Modal */}
      {showChampionModal && (
        <div className={styles.modalBackdrop} onClick={closeChampionModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-trophy-fill me-2 text-warning"></i>
                Tournament Champion
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeChampionModal}
              ></button>
            </div>

            {championLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-danger"></div>
                <p className="mt-3">Loading champion data...</p>
              </div>
            ) : championError ? (
              <div className="alert alert-danger">{championError}</div>
            ) : championData ? (
              <div className="text-center py-4">
                <div className="mb-4">
                  <div
                    className="mx-auto mb-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "4px solid #f0c000",
                      boxShadow: "0 8px 16px rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    <i
                      className="bi bi-trophy-fill"
                      style={{ fontSize: "3rem", color: "#b8860b" }}
                    ></i>
                  </div>
                  <h4 className="fw-bold">
                    {capitalizeWords(selectedTournamentForChampion?.name)}
                  </h4>
                  <p className="text-muted">
                    Year: {selectedTournamentForChampion?.year}
                  </p>
                </div>

                {championData.champion ? (
                  <div
                    className="p-4 rounded-4 shadow"
                    style={{
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      border: "3px solid #1e7e34",
                    }}
                  >
                    <div className="mb-3">
                      <i
                        className="bi bi-award-fill"
                        style={{ fontSize: "2.5rem", color: "#fff" }}
                      ></i>
                    </div>
                    <h5 className="text-white fw-bold mb-2">🏆 Champion 🏆</h5>
                    <h3 className="text-white fw-bold mb-0">
                      {capitalizeWords(championData.champion)}
                    </h3>
                  </div>
                ) : championData.hasBracket ? (
                  <div className="alert alert-warning">
                    <i className="bi bi-hourglass-split me-2"></i>
                    Tournament is in progress. No champion has been determined
                    yet.
                  </div>
                ) : (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    The tournament bracket hasn&apos;t been created yet.
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-circle me-2"></i>
                Unable to load champion data
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
