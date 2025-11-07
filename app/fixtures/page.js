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

  // ✅ Auto-refresh leaderboard
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

  // ✅ Dropdown display text
  const getDropdownText = () => {
    if (!selectedYear) return "All Tournaments";
    return `Ekeremgba − Akpauche ${selectedYear}`;
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* ✅ Tournament Selector Dropdown */}
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
                ? new Date(tournament.event_date).toLocaleDateString()
                : new Date(tournament.created_at).toLocaleDateString();

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

                        {/* ✅ Updated to show event_date or fallback to created_at */}
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar-fill text-danger me-2"></i>
                          <small> {eventDate}</small>
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
                          style={{ borderRadius: "20px" }}
                          onClick={() => openModal(tournament)}
                        >
                          <i className="bi bi-diagram-3-fill me-1"></i>
                          Groups
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          style={{ borderRadius: "20px" }}
                          onClick={() => openLeaderboardModal(tournament)}
                        >
                          <i className="bi bi-bar-chart-fill me-1"></i>
                          Leaderboard
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
      <Footer />
    </>
  );
}
