"use client";

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

  // ✅ Fetch bracket and champion
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

        // initialize matchInputs
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
        setError("No bracket data found.");
      }

      // fetch champion if exists
      const champResponse = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/champion?tournamentId=${id}`
      );
      const champData = await champResponse.json();
      if (champData?.champion) {
        setChampion(champData.champion);
      } else if (champData?.message?.includes("Final match not found")) {
        setChampion(null);
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

  // ✅ Generate next round
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

  // ✅ Handle match input changes
  const handleInputChange = (matchId, field, value) => {
    setMatchInputs((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value },
    }));
  };

  // ✅ Record winner of a match
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
      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/match/${matchId}/winner/tournament/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

  // ✅ Record Champion after final match
  const handleRecordChampion = async () => {
    setRecordingChampion(true);
    setError("");
    setSuccessMsg("");
    try {
      const response = await fetch(
        `http://localhost:5100/api/admin/champion?tournamentId=${id}`,
        { method: "POST" }
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

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading bracket data...
      </div>
    );
  }

  const rounds = bracketData ? Object.keys(bracketData) : [];
  const lastRoundMatches =
    rounds.length > 0 ? bracketData[rounds[rounds.length - 1]] : [];
  const isLastRound = lastRoundMatches?.length <= 1;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Tournament Bracket</h1>

      <div style={{ margin: "1rem 0" }}>
        <button
          onClick={handleGenerateNextRound}
          disabled={generatingNext || isLastRound}
          className="btn btn-primary"
        >
          {generatingNext
            ? "Generating Next Round..."
            : isLastRound
            ? "No More Rounds"
            : "Generate Next Round"}
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* 🏆 Show champion if available */}
      {champion && (
        <div
          style={{
            backgroundColor: "#d4edda",
            padding: "1rem",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "2rem",
            border: "2px solid #28a745",
          }}
        >
          <h2>🏆 Champion</h2>
          <h3 style={{ color: "#155724" }}>{champion}</h3>
        </div>
      )}

      {/* Button to record champion (only after final match) */}
      {isLastRound && !champion && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button
            className="btn btn-success"
            onClick={handleRecordChampion}
            disabled={recordingChampion}
          >
            {recordingChampion ? "Recording Champion..." : "Record Champion 🏆"}
          </button>
        </div>
      )}

      {rounds.map((round) => (
        <div
          key={round}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h2>{round}</h2>
          {bracketData[round].map((match) => {
            const isUpcoming = !match.winner;
            const matchInput = matchInputs[match.match_id] || {};

            return (
              <div
                key={match.match_id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "0.5rem 1rem",
                  marginBottom: "0.5rem",
                  backgroundColor: isUpcoming ? "#fff3cd" : "#e2e3e5",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{match.school1}</span>
                  <span>vs</span>
                  <span>{match.school2}</span>
                  <strong>
                    {match.winner ? `Winner: ${match.winner}` : "Winner: TBD"}
                  </strong>
                </div>

                {isUpcoming && (
                  <div
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <select
                      className="form-select"
                      style={{ width: "200px" }}
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
                      <option value={1}>{match.school1}</option>
                      <option value={2}>{match.school2}</option>
                    </select>

                    <input
                      type="number"
                      placeholder={`${match.school1} Score`}
                      className="form-control"
                      style={{ width: "120px" }}
                      value={matchInput.school1Score || ""}
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
                      placeholder={`${match.school2} Score`}
                      className="form-control"
                      style={{ width: "120px" }}
                      value={matchInput.school2Score || ""}
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
                      onClick={() => handleRecordWinner(match.match_id)}
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
    </div>
  );
}
