"use client";

import { Award, ChevronRight, Clock, Trophy } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TournamentBracketPage() {
  const { id } = useParams();
  const [bracketData, setBracketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [generatingNext, setGeneratingNext] = useState(false);
  const [updatingMatch, setUpdatingMatch] = useState(null);
  const [matchInputs, setMatchInputs] = useState({});
  const [champion, setChampion] = useState(null);
  const [recordingChampion, setRecordingChampion] = useState(false);
  const [settingActive, setSettingActive] = useState(null);
  const [activeMatchId, setActiveMatchId] = useState(null);

  const fetchBracket = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("ekereAuthToken");
      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/bracket/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      if (data?.bracket && Object.keys(data.bracket).length > 0) {
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
      } else {
        setBracketData(null);
      }

      const champResponse = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/champion?tournamentId=${id}`
      );
      const champData = await champResponse.json();
      if (champData?.champion) {
        setChampion(champData.champion);
      } else if (champData?.message?.includes("Final match not found")) {
        setChampion(null);
      }

      // Fetch active match (if endpoint exists)
      try {
        const activeResponse = await fetch(
          `https://api.ekeremgbaakpauche.com/api/admin/active-match?tournamentId=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (activeResponse.ok) {
          const activeData = await activeResponse.json();
          if (activeData?.activeMatchId) {
            setActiveMatchId(activeData.activeMatchId);
          }
        }
      } catch (activeErr) {
        console.log("Active match fetch not available");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load bracket data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchBracket();
  }, [id, fetchBracket]);

  const handleGenerateNextRound = async () => {
    setGeneratingNext(true);
    setError("");
    setSuccessMsg("");
    try {
      const token = localStorage.getItem("ekereAuthToken");
      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/generate-next-round?tournamentId=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to generate next round");

      setSuccessMsg(data.message);
      fetchBracket();
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingNext(false);
    }
  };

  const handleInputChange = (matchId, field, value) => {
    setMatchInputs((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value },
    }));
  };

  const handleRecordWinner = async (matchId) => {
    const { selectedWinner, school1Score, school2Score } =
      matchInputs[matchId] || {};

    const s1 = Number(school1Score);
    const s2 = Number(school2Score);

    if (!selectedWinner || isNaN(s1) || isNaN(s2)) {
      alert("Please select a winner and enter valid scores.");
      return;
    }

    setUpdatingMatch(matchId);
    setError("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("ekereAuthToken");
      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/match/${matchId}/winner/tournament/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            winnerId: selectedWinner,
            school1_score: s1,
            school2_score: s2,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to record winner");

      setSuccessMsg(data.message);
      fetchBracket();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingMatch(null);
    }
  };

  const handleRecordChampion = async () => {
    setRecordingChampion(true);
    setError("");
    setSuccessMsg("");
    try {
      const token = localStorage.getItem("ekereAuthToken");
      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/champion?tournamentId=${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to record champion");

      setChampion(data.champion);
      setSuccessMsg(data.message || "Champion recorded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setRecordingChampion(false);
    }
  };

  const handleSetActiveMatch = async (matchId) => {
    setSettingActive(matchId);
    setError("");
    setSuccessMsg("");
    try {
      const token = localStorage.getItem("ekereAuthToken");
      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/match/${matchId}/active-match/tournament/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to set active match");

      setActiveMatchId(matchId);
      setSuccessMsg(data.message || "Active match set successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSettingActive(null);
    }
  };

  if (loading)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fw-semibold">Loading bracket data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="text-danger fs-1 mb-3">⚠️</div>
          <h4 className="text-danger fw-bold">{error}</h4>
        </div>
      </div>
    );

  // Empty state for no bracket data
  if (!bracketData || Object.keys(bracketData).length === 0) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center py-5 px-4">
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
            <Trophy size={64} className="text-muted" />
          </div>
          <h4 className="text-muted fw-bold mb-2">No Bracket Available</h4>
          <p className="text-muted">
            The tournament bracket hasn&apos;t been created yet.
            <br />
            Please check back later for updates.
          </p>
        </div>
      </div>
    );
  }

  const rounds = bracketData ? Object.keys(bracketData) : [];
  const lastRoundMatches =
    rounds.length > 0 ? bracketData[rounds[rounds.length - 1]] : [];
  const isLastRound = lastRoundMatches?.length <= 1;

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container-fluid px-4">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <Trophy className="text-warning" size={32} />
            <h1 className="fw-bold text-dark mb-0">Tournament Bracket</h1>
          </div>

          {/* Action Button */}
          <div className="mt-3">
            <button
              onClick={handleGenerateNextRound}
              disabled={generatingNext || isLastRound}
              className="bracket-btn px-4 py-2 fw-semibold rounded-pill"
            >
              {generatingNext
                ? "Generating Next Round..."
                : isLastRound
                ? "No More Rounds"
                : "Generate Next Round"}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div
            className="alert alert-success text-center fw-semibold shadow-sm mx-auto"
            style={{ maxWidth: "600px" }}
          >
            {successMsg}
          </div>
        )}

        {/* Champion Banner */}
        {champion && (
          <div
            className="text-center p-4 rounded-4 mb-4 shadow mx-auto"
            style={{
              maxWidth: "700px",
              background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
              border: "3px solid #f0c000",
            }}
          >
            <Award className="text-warning mb-2" size={48} />
            <h2 className="fw-bold text-dark mb-1">🏆 Champion</h2>
            <h3 className="text-dark fw-bold">{champion}</h3>
          </div>
        )}

        {/* Record Champion Button */}
        {isLastRound && !champion && (
          <div className="text-center mb-4">
            <button
              className="btn btn-success px-5 py-2 fw-semibold shadow rounded-pill"
              onClick={handleRecordChampion}
              disabled={recordingChampion}
            >
              <Trophy size={18} className="me-2" />
              {recordingChampion ? "Recording Champion..." : "Record Champion"}
            </button>
          </div>
        )}

        {/* Bracket Rounds */}
        <div className="row g-4">
          {rounds.map((round, roundIndex) => (
            <div key={round} className="col-12">
              {/* Round Header */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="px-3 py-2 rounded-3 shadow d-inline-flex align-items-center gap-2"
                  style={{
                    background: "linear-gradient(#c71d12 0%, #680b05 100%)",
                    color: "white",
                  }}
                >
                  <span className="fw-bold">{round}</span>
                </div>
                {roundIndex < rounds.length - 1 && (
                  <ChevronRight className="text-muted" size={24} />
                )}
              </div>

              {/* Matches Grid */}
              <div className="row g-3">
                {bracketData[round].map((match) => {
                  const isUpcoming = !match.winner;
                  const matchInput = matchInputs[match.match_id] || {};
                  const isActiveMatch = match.match_id === activeMatchId;

                  return (
                    <div
                      key={match.match_id}
                      className="col-12 col-md-6 col-lg-4"
                    >
                      <div
                        className="card h-100 shadow-sm border-0"
                        style={{
                          borderLeft: isActiveMatch
                            ? "4px solid #00ff00"
                            : isUpcoming
                            ? "4px solid #ffc107"
                            : "4px solid #6c757d",
                          background: isActiveMatch
                            ? "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
                            : "white",
                          transition: "transform 0.2s",
                        }}
                      >
                        <div className="card-body">
                          {/* Match Header */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="text-muted fw-semibold">
                              Match {match.match_id}
                              {isActiveMatch && (
                                <span className="badge bg-success ms-2">
                                  ACTIVE
                                </span>
                              )}
                            </small>
                            {match.match_time && (
                              <div className="d-flex align-items-center gap-1 text-danger small">
                                <Clock size={14} />
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
                              style={{ minWidth: "20px", textAlign: "center" }}
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
                              style={{ minWidth: "20px", textAlign: "center" }}
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
                              <strong>Winner:</strong> {match.winner}
                            </div>
                          )}

                          {/* Input Controls for Upcoming Matches */}
                          {isUpcoming && (
                            <div className="mt-3 pt-3 border-top">
                              <select
                                className="form-select form-select-sm mb-2"
                                value={matchInput.selectedWinner || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    match.match_id,
                                    "selectedWinner",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Winner</option>
                                <option value={match.school1Id}>
                                  {match.school1}
                                </option>
                                <option value={match.school2Id}>
                                  {match.school2}
                                </option>
                              </select>

                              <div className="row g-2 mb-2">
                                <div className="col-6">
                                  <input
                                    type="number"
                                    placeholder="Score 1"
                                    className="form-control form-control-sm"
                                    value={matchInput.school1Score || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        match.match_id,
                                        "school1Score",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="col-6">
                                  <input
                                    type="number"
                                    placeholder="Score 2"
                                    className="form-control form-control-sm"
                                    value={matchInput.school2Score || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        match.match_id,
                                        "school2Score",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-success btn-sm flex-grow-1"
                                  disabled={updatingMatch === match.match_id}
                                  onClick={() =>
                                    handleRecordWinner(match.match_id)
                                  }
                                >
                                  {updatingMatch === match.match_id
                                    ? "Recording..."
                                    : "Record Winner"}
                                </button>
                                <button
                                  className="btn btn-primary btn-sm"
                                  disabled={
                                    settingActive === match.match_id ||
                                    isActiveMatch
                                  }
                                  onClick={() =>
                                    handleSetActiveMatch(match.match_id)
                                  }
                                  title="Set as active match"
                                >
                                  {settingActive === match.match_id
                                    ? "Setting..."
                                    : isActiveMatch
                                    ? "Active"
                                    : "Set Active"}
                                </button>
                              </div>
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
    </div>
  );
}
