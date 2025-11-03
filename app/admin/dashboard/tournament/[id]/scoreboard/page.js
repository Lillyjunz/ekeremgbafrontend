"use client";

import { ArrowLeft, Award, Clock, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";
import {
  default as modalStyles,
  default as pageStyles,
} from "./scoreboard.module.css";

export default function ScoreboardPage() {
  const [token, setToken] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [schoolsMap, setSchoolsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMatch, setActiveMatch] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scores, setScores] = useState({
    school1_score: "",
    school2_score: "",
    winnerId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setToken("demo-token");
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const demoData = {
          activeMatch: {
            id: 1,
            tournament_id: 100,
            school1_id: 20,
            school2_id: 11,
            school1_score: 45,
            school2_score: 38,
            winner_id: null,
            round: "Semi Finals",
            isOngoing: "true",
          },
        };

        const map = {
          20: "Victory High School",
          11: "Excellence Academy",
          21: "Summit College",
          12: "Pioneer Institute",
        };
        setSchoolsMap(map);

        const roundName = demoData.activeMatch.round || "Round of 32";
        setBracket({
          [roundName]: [
            {
              match_id: demoData.activeMatch.id,
              tournament_id: demoData.activeMatch.tournament_id,
              school1: map[demoData.activeMatch.school1_id],
              school2: map[demoData.activeMatch.school2_id],
              school1_score: demoData.activeMatch.school1_score ?? 0,
              school2_score: demoData.activeMatch.school2_score ?? 0,
              school1Id: demoData.activeMatch.school1_id,
              school2Id: demoData.activeMatch.school2_id,
              winner: demoData.activeMatch.winner_id
                ? map[demoData.activeMatch.winner_id]
                : null,
              isActive: demoData.activeMatch.isOngoing === "true",
            },
          ],
        });
        setActiveMatch(demoData.activeMatch);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load match data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleOpenScoreForm = () => {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("✅ Scores recorded successfully!");
      setShowScoreModal(false);
      setActiveMatch((prev) => ({
        ...prev,
        winner_id: scores.winnerId,
        school1_score: scores.school1_score,
        school2_score: scores.school2_score,
      }));
    } catch (err) {
      console.error("Error submitting scores:", err);
      alert("Network error. Please try again.");
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

  if (!bracket)
    return (
      <div
        className={`${pageStyles.pageContainer} d-flex justify-content-center align-items-center`}
      >
        <div style={{ color: "#cbd5e1", fontSize: "1.125rem" }}>
          No active match found.
        </div>
      </div>
    );

  const currentRoundName = Object.keys(bracket)[0];
  const currentMatches = bracket[currentRoundName];

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
            <span>Current Round</span>
          </div>
          <h1 className={pageStyles.roundTitle}>{currentRoundName}</h1>

          {activeMatch && (
            <div className="mt-4">
              <button
                className={`btn ${pageStyles.recordButton}`}
                onClick={handleOpenScoreForm}
              >
                <Award size={20} className="me-2" />
                Record Match Scores
              </button>
            </div>
          )}
        </div>

        {/* Matches */}
        <div className="row g-4 justify-content-center">
          {currentMatches.map((match) => {
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
                    <div className="col-12 col-md-5">
                      <h3
                        className={`${pageStyles.schoolName} ${
                          school1Score > school2Score
                            ? pageStyles.schoolNameWinning
                            : ""
                        }`}
                      >
                        {match.school1}
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
                    </div>

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

                    <div className="col-12 col-md-5">
                      <h3
                        className={`${pageStyles.schoolName} ${
                          school2Score > school1Score
                            ? pageStyles.schoolNameWinning
                            : ""
                        }`}
                      >
                        {match.school2}
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
                    </div>
                  </div>

                  {match.winner && (
                    <div className="text-center mt-4">
                      <span className={pageStyles.winnerBadge}>
                        <Trophy size={20} />
                        <span>Winner: {match.winner}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Modal */}
      {showScoreModal && (
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
                      {schoolsMap[activeMatch?.school1_id]} vs{" "}
                      {schoolsMap[activeMatch?.school2_id]}
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
                      <option value={activeMatch?.school1_id}>
                        {schoolsMap[activeMatch?.school1_id]}
                      </option>
                      <option value={activeMatch?.school2_id}>
                        {schoolsMap[activeMatch?.school2_id]}
                      </option>
                    </select>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label className={modalStyles.formLabel}>
                        {schoolsMap[activeMatch?.school1_id]}
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
                        {schoolsMap[activeMatch?.school2_id]}
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
