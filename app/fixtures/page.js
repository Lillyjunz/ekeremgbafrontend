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
  const [successMsg, setSuccessMsg] = useState("");
  const [generatingNext, setGeneratingNext] = useState(false);
  const [updatingMatch, setUpdatingMatch] = useState(null);
  const [matchInputs, setMatchInputs] = useState({});
  const [champion, setChampion] = useState(null);
  const [recordingChampion, setRecordingChampion] = useState(false);

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
        const initialInputs = {};
        Object.values(data.bracket)
          .flat()
          .forEach((match) => {
            initialInputs[match.match_id] = {
              selectedWinner: "",
              school1Score: "",
              school2Score: "",
            };
          });
        setMatchInputs(initialInputs);
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

  // ✅ Input change
  const handleInputChange = (id, field, val) =>
    setMatchInputs((p) => ({ ...p, [id]: { ...p[id], [field]: val } }));

  // ✅ Record winner
  const handleRecordWinner = async (matchId) => {
    const { selectedWinner, school1Score, school2Score } =
      matchInputs[matchId] || {};
    if (!selectedWinner || !school1Score || !school2Score) {
      alert("Please fill all fields and select a winner.");
      return;
    }
    setUpdatingMatch(matchId);
    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/match/${matchId}/winner/tournament/${selectedTournament.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            winnerId: selectedWinner,
            school1_score: Number(school1Score),
            school2_score: Number(school2Score),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg(data.message);
      fetchBracket(selectedTournament.id);
    } catch (err) {
      setBracketError(err.message);
    } finally {
      setUpdatingMatch(null);
    }
  };

  // ✅ Generate next round
  const handleGenerateNextRound = async () => {
    setGeneratingNext(true);
    try {
      const token = getAuthToken();
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/generate-next-round?tournamentId=${selectedTournament.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg(data.message);
      fetchBracket(selectedTournament.id);
    } catch (err) {
      setBracketError(err.message);
    } finally {
      setGeneratingNext(false);
    }
  };

  // ✅ Record Champion
  const handleRecordChampion = async () => {
    setRecordingChampion(true);
    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/champion?tournamentId=${selectedTournament.id}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setChampion(data.champion);
      setSuccessMsg("Champion recorded successfully!");
    } catch (err) {
      setBracketError(err.message);
    } finally {
      setRecordingChampion(false);
    }
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
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="col-md-6 col-lg-4 mb-4"
                onClick={() => openModal(t)}
              >
                <div
                  className="card shadow-sm h-100"
                  style={{ borderRadius: "15px", cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5 className="fw-bold">{t.name}</h5>
                    <p className="text-muted">{t.year}</p>
                    <small className="text-muted">{t.location}</small>
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
              ) : (
                bracketData && (
                  <div style={{ padding: "1rem" }}>
                    <h4>Tournament Bracket</h4>

                    {champion && (
                      <div className="alert alert-success text-center">
                        🏆 Champion: {champion}
                      </div>
                    )}

                    <button
                      className="btn btn-primary mb-3"
                      disabled={generatingNext}
                      onClick={handleGenerateNextRound}
                    >
                      {generatingNext
                        ? "Generating Next Round..."
                        : "Generate Next Round"}
                    </button>

                    {Object.keys(bracketData).map((round) => (
                      <div key={round} className="mb-4 border p-3 rounded">
                        <h5>{round}</h5>
                        {bracketData[round].map((match) => {
                          const isUpcoming = !match.winner;
                          const m = matchInputs[match.match_id] || {};
                          return (
                            <div
                              key={match.match_id}
                              className="mb-3 p-2 rounded"
                              style={{
                                background: isUpcoming ? "#fff3cd" : "#e2e3e5",
                              }}
                            >
                              <div className="d-flex justify-content-between">
                                <span>{match.school1}</span>
                                <span>vs</span>
                                <span>{match.school2}</span>
                                <strong>
                                  {match.winner
                                    ? `Winner: ${match.winner}`
                                    : "Winner: TBD"}
                                </strong>
                              </div>

                              {isUpcoming && (
                                <div className="mt-2 d-flex flex-wrap gap-2">
                                  <select
                                    className="form-select"
                                    style={{ width: "180px" }}
                                    value={m.selectedWinner}
                                    onChange={(e) =>
                                      handleInputChange(
                                        match.match_id,
                                        "selectedWinner",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Select Winner</option>
                                    <option value={1}>{match.school1}</option>
                                    <option value={2}>{match.school2}</option>
                                  </select>
                                  <input
                                    type="number"
                                    className="form-control"
                                    style={{ width: "120px" }}
                                    placeholder={`${match.school1} Score`}
                                    value={m.school1Score}
                                    onChange={(e) =>
                                      handleInputChange(
                                        match.match_id,
                                        "school1Score",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <input
                                    type="number"
                                    className="form-control"
                                    style={{ width: "120px" }}
                                    placeholder={`${match.school2} Score`}
                                    value={m.school2Score}
                                    onChange={(e) =>
                                      handleInputChange(
                                        match.match_id,
                                        "school2Score",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <button
                                    className="btn btn-success"
                                    disabled={updatingMatch === match.match_id}
                                    onClick={() =>
                                      handleRecordWinner(match.match_id)
                                    }
                                  >
                                    {updatingMatch === match.match_id
                                      ? "Recording..."
                                      : "Record Winner"}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    {!champion && (
                      <button
                        className="btn btn-success"
                        disabled={recordingChampion}
                        onClick={handleRecordChampion}
                      >
                        {recordingChampion
                          ? "Recording Champion..."
                          : "Record Champion 🏆"}
                      </button>
                    )}
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
