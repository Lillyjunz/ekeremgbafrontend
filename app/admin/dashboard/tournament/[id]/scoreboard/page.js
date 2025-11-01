"use client";

import { ArrowLeft, Info, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./scoreboard.module.css";

export default function ScoreboardPage() {
  const [token, setToken] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [schoolsMap, setSchoolsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);
  const [scores, setScores] = useState({
    school1_score: "",
    school2_score: "",
    winnerId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const tournamentId = 2; // static for now

  // ✅ Get token from localStorage safely
  useEffect(() => {
    const storedToken = localStorage.getItem("ekereAuthToken");
    setToken(storedToken);
  }, []);

  // ✅ Combined fetching for bracket + active match
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [bracketRes, activeRes] = await Promise.all([
          fetch(
            `https://api.ekeremgbaakpauche.com/api/admin/bracket/${tournamentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `https://api.ekeremgbaakpauche.com/api/admin/get-active-match`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const bracketData = await bracketRes.json();
        const activeData = await activeRes.json();

        if (!bracketRes.ok)
          throw new Error(bracketData.message || "Failed to fetch bracket");

        setBracket(bracketData.bracket || {});
        setActiveMatch(activeData?.activeMatch || null);

        // Build school map
        const map = {};
        Object.values(bracketData.bracket || {})
          .flat()
          .forEach((m) => {
            map[m.school1Id] = m.school1;
            map[m.school2Id] = m.school2;
          });
        setSchoolsMap(map);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [token]);

  const handleOpenScoreForm = (match) => {
    setActiveMatch(match);
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

    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/match/${
          activeMatch.match_id || activeMatch.id
        }/winner/tournament/${tournamentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            winnerId: Number(scores.winnerId),
            school1_score: Number(scores.school1_score),
            school2_score: Number(scores.school2_score),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to record scores");

      alert(data.message);
      setActiveMatch(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading scoreboard...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;
  if (!bracket)
    return <p style={{ padding: "2rem" }}>No bracket data found.</p>;

  const currentRoundName = Object.keys(bracket).find((round) =>
    bracket[round].some((match) => match.winner === null)
  );
  let currentMatches = currentRoundName ? [...bracket[currentRoundName]] : [];

  // Merge activeMatch if not already in currentMatches
  if (activeMatch) {
    const exists = currentMatches.some((m) => m.match_id === activeMatch.id);
    if (!exists) {
      currentMatches.unshift({
        match_id: activeMatch.id,
        school1:
          schoolsMap[activeMatch.school1_id] ||
          `School ${activeMatch.school1_id}`,
        school2:
          schoolsMap[activeMatch.school2_id] ||
          `School ${activeMatch.school2_id}`,
        school1_score: activeMatch.school1_score,
        school2_score: activeMatch.school2_score,
        winner: activeMatch.winner_id
          ? schoolsMap[activeMatch.winner_id]
          : null,
        isActive: true,
      });
    }
  }

  return (
    <div className={styles.container}>
      {/* ✅ Fixed: No refresh */}
      <Link href="/admin/dashboard" className={styles.backButton}>
        <ArrowLeft size={16} />
        &nbsp;Go back to home
      </Link>

      <div className={styles.topicWrapper}>
        <p className={styles.topicLabel}>CURRENT ROUND</p>
        <h1 className={styles.topicText}>
          {currentRoundName || "All Matches Completed"}
        </h1>
      </div>

      {currentMatches.length === 0 && <p>No ongoing matches currently.</p>}

      {currentMatches.map((match) => {
        const isActive = activeMatch?.id === match.match_id || match.isActive;

        return (
          <div
            key={match.match_id}
            className={`${styles.scoreboardBox} ${
              isActive ? styles.activeMatch : ""
            }`}
          >
            <div className={styles.matchup}>
              <span className={styles.teamLeft}>{match.school1}</span>
              <span className={styles.vs}>VS</span>
              <span className={styles.teamRight}>{match.school2}</span>
            </div>

            <div className={styles.scoreSection}>
              <div className={styles.centerScore}>
                {match.school1_score || 0} : {match.school2_score || 0}
              </div>
            </div>

            {match.winner === null && (
              <button
                className="btn btn-primary mt-3"
                onClick={() => handleOpenScoreForm(match)}
              >
                Record Scores
              </button>
            )}
          </div>
        );
      })}

      {/* Score Recording Modal */}
      {activeMatch && (
        <div className={styles.popup}>
          <div className={styles.popupHeader}>
            <h4>
              Record Scores for{" "}
              {schoolsMap[activeMatch.school1_id] || activeMatch.school1} vs{" "}
              {schoolsMap[activeMatch.school2_id] || activeMatch.school2}
            </h4>
            <button
              className={styles.closeBtn}
              onClick={() => setActiveMatch(null)}
            >
              <X size={16} />
            </button>
          </div>
          <div className={styles.popupContent}>
            <div style={{ marginBottom: "1rem" }}>
              <label>Winner:</label>
              <select
                value={scores.winnerId}
                onChange={(e) =>
                  setScores({ ...scores, winnerId: e.target.value })
                }
              >
                <option value="">Select Winner</option>
                <option value={activeMatch.school1_id}>
                  {schoolsMap[activeMatch.school1_id] || activeMatch.school1}
                </option>
                <option value={activeMatch.school2_id}>
                  {schoolsMap[activeMatch.school2_id] || activeMatch.school2}
                </option>
              </select>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>
                {schoolsMap[activeMatch.school1_id] || activeMatch.school1}{" "}
                Score:
              </label>
              <input
                type="number"
                value={scores.school1_score}
                onChange={(e) =>
                  setScores({ ...scores, school1_score: e.target.value })
                }
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>
                {schoolsMap[activeMatch.school2_id] || activeMatch.school2}{" "}
                Score:
              </label>
              <input
                type="number"
                value={scores.school2_score}
                onChange={(e) =>
                  setScores({ ...scores, school2_score: e.target.value })
                }
              />
            </div>
            <button
              className="btn btn-success"
              onClick={handleRecordScores}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Scores"}
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className={styles.instructionsWrapper}>
        <button
          className={styles.instructionsBtn}
          onClick={() => setShowInstructions(!showInstructions)}
        >
          <Info size={16} />
          Instructions
        </button>

        {showInstructions && (
          <div className={styles.popup}>
            <div className={styles.popupHeader}>
              <h4>
                <Info size={18} /> Instructions
              </h4>
              <button
                className={styles.closeBtn}
                onClick={() => setShowInstructions(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className={styles.popupContent}>
              <div className={styles.instructionItem}>
                <span>• Each student speaks for 5 minutes</span>
              </div>
              <div className={styles.instructionItem}>
                <span>• Judges award up to 20 points per round</span>
              </div>
              <div className={styles.instructionItem}>
                <span>• Real-time scoring updates during debate</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showInstructions && (
        <div
          className={styles.overlay}
          onClick={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
}
