"use client";

import { ArrowLeft, Award, Clock, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";
import {
  default as modalStyles,
  default as pageStyles,
} from "./scoreboard.module.css";

// Utility to capitalize each word
const capitalizeWords = (str) => {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function ScoreboardPage() {
  const [token, setToken] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tournamentInfo, setTournamentInfo] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scores, setScores] = useState({
    school1_score: "",
    school2_score: "",
    winnerId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Get token from localStorage
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ekereAuthToken");
    }
    return null;
  };

  useEffect(() => {
    const authToken = getAuthToken();
    if (authToken) {
      setToken(authToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://api.ekeremgbaakpauche.com/api/admin/get-active-match",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch active matches");
        }

        const matchesData = data.data;

        if (!matchesData || matchesData.length === 0) {
          setMatches([]);
          setTournamentInfo(null);
          setLoading(false);
          return;
        }

        // Extract tournament info from first match
        const firstMatch = matchesData[0].match;
        setTournamentInfo({
          name: firstMatch.tournament_name,
          year: firstMatch.tournament_year,
          location: firstMatch.tournament_location,
          time: firstMatch.tournament_time,
          description: firstMatch.tournament_description,
        });

        // Process all matches
        const processedMatches = matchesData.map((item) => {
          const match = item.match;

          return {
            match_id: match.match_id,
            tournament_id: match.tournament_id,
            round: match.round || "First Round",
            school1: match.school1_name,
            school2: match.school2_name,
            school1_score: match.school1_score ?? 0,
            school2_score: match.school2_score ?? 0,
            school1_id: match.school1_id,
            school2_id: match.school2_id,
            school1Students: item.school1Students || [],
            school2Students: item.school2Students || [],
            winner_id: match.winner_id,
            winner: match.winner_id
              ? match.winner_id === match.school1_id
                ? match.school1_name
                : match.school2_name
              : null,
            isActive: match.isOngoing === "1" || match.isOngoing === "true",
            tournament_name: match.tournament_name,
            tournament_year: match.tournament_year,
            tournament_location: match.tournament_location,
            tournament_time: match.tournament_time,
          };
        });

        setMatches(processedMatches);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load match data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto refresh every 2 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 120000);

    return () => clearInterval(interval);
  }, [token]);

  const handleOpenScoreForm = (match) => {
    setSelectedMatch(match);
    setShowScoreModal(true);
    setScores({ school1_score: "", school2_score: "", winnerId: "" });
  };

  const handleRecordScores = async () => {
    if (
      !scores.winnerId ||
      scores.school1_score === "" ||
      scores.school2_score === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        alert("Missing auth token. Please log in again.");
        return;
      }

      // Call the winner API
      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/match/${selectedMatch.match_id}/winner/tournament/${selectedMatch.tournament_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            winnerId: parseInt(scores.winnerId),
            school1_score: parseInt(scores.school1_score),
            school2_score: parseInt(scores.school2_score),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to record winner");
      }

      alert("✅ Scores recorded successfully!");
      setShowScoreModal(false);

      // Update local state
      setMatches((prevMatches) =>
        prevMatches.map((match) => {
          if (match.match_id === selectedMatch.match_id) {
            return {
              ...match,
              winner_id: parseInt(scores.winnerId),
              school1_score: parseInt(scores.school1_score),
              school2_score: parseInt(scores.school2_score),
              winner:
                parseInt(scores.winnerId) === match.school1_id
                  ? match.school1
                  : match.school2,
            };
          }
          return match;
        })
      );
    } catch (err) {
      console.error("Error submitting scores:", err);
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div
        className={`${pageStyles.pageContainer} d-flex justify-content-center align-items-center`}
      >
        <div className="text-center">
          <div
            className="spinner-border text-warning mb-3"
            style={{ width: "3rem", height: "3rem" }}
          ></div>
          <div style={{ color: "#cbd5e1", fontSize: "1.125rem" }}>
            Loading scoreboard...
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className={`${pageStyles.pageContainer} d-flex justify-content-center align-items-center`}
      >
        <div
          style={{ color: "#ef4444", fontSize: "1.25rem", fontWeight: "600" }}
        >
          {error}
        </div>
      </div>
    );

  if (matches.length === 0)
    return (
      <div
        className={`${pageStyles.pageContainer} d-flex justify-content-center align-items-center`}
      >
        <div style={{ color: "#cbd5e1", fontSize: "1.125rem" }}>
          No active matches found.
        </div>
      </div>
    );

  return (
    <div className={pageStyles.pageContainer}>
      <div className={pageStyles.pageOverlay}></div>

      {/* Header */}
      <div className={pageStyles.header}>
        <div className="container d-flex justify-content-between align-items-center">
          <button
            className={`btn d-flex align-items-center gap-2 ${pageStyles.backButton}`}
          >
            <ArrowLeft size={18} />
            <Link href="/admin/dashboard">
              <span>Back to Home</span>
            </Link>
          </button>
        </div>
      </div>

      {/* Round */}
      <div
        className="container py-5"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="text-center mb-5">
          <div className={pageStyles.roundBadge}>
            <Trophy size={20} />
            <span>Active Matches</span>
          </div>
          <h1 className={pageStyles.roundTitle}>
            {matches[0]?.round || "Tournament Matches"}
          </h1>

          {/* Tournament Info */}
          {tournamentInfo && (
            <div
              className="mt-3"
              style={{ color: "#cbd5e1", fontSize: "0.95rem" }}
            >
              <div>
                {capitalizeWords(tournamentInfo.name)} {tournamentInfo.year}
              </div>
              <div>
                {tournamentInfo.location} • {tournamentInfo.time}
              </div>
              {tournamentInfo.description && (
                <div style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                  {tournamentInfo.description}
                </div>
              )}
            </div>
          )}

          <div
            className="mt-3"
            style={{
              color: "#4ade80",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            <Zap size={16} className="me-1" />
            {matches.length} {matches.length === 1 ? "Match" : "Matches"} Live
          </div>
        </div>

        {/* Matches */}
        <div className="row g-4 justify-content-center">
          {matches.map((match) => {
            const school1Score = Number(match.school1_score) || 0;
            const school2Score = Number(match.school2_score) || 0;
            const isLive = match.isActive && match.winner === null;

            return (
              <div key={match.match_id} className="col-12 col-xl-10">
                <div
                  className={`${pageStyles.matchCard} ${
                    isLive ? pageStyles.matchCardLive : ""
                  }`}
                >
                  {isLive && (
                    <div className={pageStyles.liveBadge}>
                      <div className={pageStyles.pulse}></div>
                      <span>LIVE</span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <span className={pageStyles.matchBadge}>
                      <Users size={16} className="me-2" />
                      Match {match.match_id}
                    </span>
                    {isLive && (
                      <span className={pageStyles.inProgressBadge}>
                        <Zap size={16} className="me-2" />
                        In Progress
                      </span>
                    )}
                  </div>

                  <div className="row align-items-center text-center g-4">
                    {/* School 1 */}
                    <div className="col-12 col-md-5">
                      <h3
                        className={`${pageStyles.schoolName} ${
                          school1Score > school2Score
                            ? pageStyles.schoolNameWinning
                            : ""
                        }`}
                      >
                        {capitalizeWords(match.school1)}
                      </h3>
                      <div
                        className={`${pageStyles.scoreDisplay} ${
                          school1Score > school2Score
                            ? pageStyles.scoreDisplayWinning
                            : ""
                        }`}
                      >
                        {school1Score}
                      </div>

                      {/* School 1 Students */}
                      {match.school1Students &&
                        match.school1Students.length > 0 && (
                          <div
                            className="mt-3"
                            style={{ fontSize: "0.85rem", color: "#94a3b8" }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                marginBottom: "0.5rem",
                              }}
                            >
                              Team Members:
                            </div>
                            {match.school1Students.map((student) => (
                              <div key={student.id}>
                                {capitalizeWords(student.fullname)}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* VS */}
                    <div className="col-12 col-md-2">
                      <div className={pageStyles.vsCircle}>VS</div>
                      {isLive && (
                        <div
                          className="mt-3"
                          style={{
                            color: "#4ade80",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          <Clock size={14} className="me-1" />
                          Ongoing
                        </div>
                      )}
                    </div>

                    {/* School 2 */}
                    <div className="col-12 col-md-5">
                      <h3
                        className={`${pageStyles.schoolName} ${
                          school2Score > school1Score
                            ? pageStyles.schoolNameWinning
                            : ""
                        }`}
                      >
                        {capitalizeWords(match.school2)}
                      </h3>
                      <div
                        className={`${pageStyles.scoreDisplay} ${
                          school2Score > school1Score
                            ? pageStyles.scoreDisplayWinning
                            : ""
                        }`}
                      >
                        {school2Score}
                      </div>

                      {/* School 2 Students */}
                      {match.school2Students &&
                        match.school2Students.length > 0 && (
                          <div
                            className="mt-3"
                            style={{ fontSize: "0.85rem", color: "#94a3b8" }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                marginBottom: "0.5rem",
                              }}
                            >
                              Team Members:
                            </div>
                            {match.school2Students.map((student) => (
                              <div key={student.id}>
                                {capitalizeWords(student.fullname)}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {match.winner && (
                    <div className="text-center mt-4">
                      <span className={pageStyles.winnerBadge}>
                        <Trophy size={20} />
                        <span>Winner: {capitalizeWords(match.winner)}</span>
                      </span>
                    </div>
                  )}

                  {/* Record Scores Button */}
                  {isLive && (
                    <div className="text-center mt-4">
                      <button
                        className={`btn ${pageStyles.recordButton}`}
                        onClick={() => handleOpenScoreForm(match)}
                      >
                        <Award size={20} className="me-2" />
                        Record Scores
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Modal */}
      {showScoreModal && selectedMatch && (
        <>
          <div
            className={modalStyles.modalBackdrop}
            onClick={() => setShowScoreModal(false)}
          ></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className={`modal-content ${modalStyles.modalContent}`}>
                <div className={modalStyles.modalHeader}>
                  Record Match Scores
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowScoreModal(false)}
                  ></button>
                </div>
                <div className={modalStyles.modalBody}>
                  <div className={modalStyles.scoreMatchInfo}>
                    <strong>
                      {capitalizeWords(selectedMatch.school1)} vs{" "}
                      {capitalizeWords(selectedMatch.school2)}
                    </strong>
                  </div>

                  <div className="mb-4">
                    <label className={modalStyles.formLabel}>
                      Select Winner
                    </label>
                    <select
                      className={`form-select ${modalStyles.formControl}`}
                      value={scores.winnerId}
                      onChange={(e) =>
                        setScores({ ...scores, winnerId: e.target.value })
                      }
                    >
                      <option value="">Choose winner...</option>
                      <option value={selectedMatch.school1_id}>
                        {capitalizeWords(selectedMatch.school1)}
                      </option>
                      <option value={selectedMatch.school2_id}>
                        {capitalizeWords(selectedMatch.school2)}
                      </option>
                    </select>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label className={modalStyles.formLabel}>
                        {capitalizeWords(selectedMatch.school1)}
                      </label>
                      <input
                        type="number"
                        className={`form-control ${modalStyles.formControl}`}
                        value={scores.school1_score}
                        onChange={(e) =>
                          setScores({
                            ...scores,
                            school1_score: e.target.value,
                          })
                        }
                        placeholder="Score"
                      />
                    </div>
                    <div className="col-6">
                      <label className={modalStyles.formLabel}>
                        {capitalizeWords(selectedMatch.school2)}
                      </label>
                      <input
                        type="number"
                        className={`form-control ${modalStyles.formControl}`}
                        value={scores.school2_score}
                        onChange={(e) =>
                          setScores({
                            ...scores,
                            school2_score: e.target.value,
                          })
                        }
                        placeholder="Score"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="modal-footer"
                  style={{
                    borderTop: "1px solid rgba(148, 163, 184, 0.2)",
                    padding: "1.5rem 2rem",
                  }}
                >
                  <button
                    className={modalStyles.submitButton}
                    onClick={handleRecordScores}
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Scores"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
