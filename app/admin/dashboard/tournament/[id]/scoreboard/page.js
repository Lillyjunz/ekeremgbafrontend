"use client";

import { ArrowLeft, Info, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./scoreboard.module.css";

export default function ScoreboardPage() {
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null); // match currently recording scores
  const [scores, setScores] = useState({
    school1_score: "",
    school2_score: "",
    winnerId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const tournamentId = 2; // static for now, can make dynamic

  const fetchBracket = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/bracket/${tournamentId}`
      );
      if (!res.ok) throw new Error("Failed to fetch bracket data");
      const data = await res.json();
      setBracket(data.bracket);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracket();
    const interval = setInterval(fetchBracket, 5000);
    return () => clearInterval(interval);
  }, []);

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

    setSubmitting(true);
    try {
      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/match/${activeMatch.match_id}/winner/tournament/${tournamentId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      fetchBracket(); // refresh bracket
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
  const currentMatches = currentRoundName ? bracket[currentRoundName] : [];

  return (
    <div className={styles.container}>
      <button className={styles.backButton}>
        <Link href="/admin/dashboard">
          <ArrowLeft size={16} />
          &nbsp;Go back to home
        </Link>
      </button>

      <div className={styles.topicWrapper}>
        <p className={styles.topicLabel}>CURRENT ROUND</p>
        <h1 className={styles.topicText}>
          {currentRoundName || "All Matches Completed"}
        </h1>
      </div>

      {currentMatches.length === 0 && <p>No ongoing matches currently.</p>}

      {currentMatches.map((match) => (
        <div key={match.match_id} className={styles.scoreboardBox}>
          <div className={styles.matchup}>
            <span className={styles.teamLeft}>{match.school1}</span>
            <span className={styles.vs}>VS</span>
            <span className={styles.teamRight}>{match.school2}</span>
          </div>

          <div className={styles.scoreSection}>
            <div className={styles.teamScores}>
              <div className={styles.teamColumn}>
                <h5>Students</h5>
                <ul>
                  {match.school1_students?.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  )) || <li>Student list not available</li>}
                </ul>
              </div>
              <div className={styles.teamColumn}>
                <h5>Score</h5>
                <ul>
                  {match.school1_students?.map((s) => (
                    <li key={s.id}>{s.score || 0}</li>
                  )) || <li>0</li>}
                </ul>
              </div>

              <div className={styles.centerScore}>
                {match.school1_total || 0} : {match.school2_total || 0}
              </div>

              <div className={styles.teamColumn}>
                <h5>Students</h5>
                <ul>
                  {match.school2_students?.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  )) || <li>Student list not available</li>}
                </ul>
              </div>
              <div className={styles.teamColumn}>
                <h5>Score</h5>
                <ul>
                  {match.school2_students?.map((s) => (
                    <li key={s.id}>{s.score || 0}</li>
                  )) || <li>0</li>}
                </ul>
              </div>
            </div>

            <div className={styles.timer}>Time : {match.timer || "00:00"}</div>
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
      ))}

      {/* Score Recording Modal */}
      {activeMatch && (
        <div className={styles.popup}>
          <div className={styles.popupHeader}>
            <h4>
              Record Scores for {activeMatch.school1} vs {activeMatch.school2}
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
                <option value={1}>{activeMatch.school1}</option>
                <option value={2}>{activeMatch.school2}</option>
              </select>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>{activeMatch.school1} Score:</label>
              <input
                type="number"
                value={scores.school1_score}
                onChange={(e) =>
                  setScores({ ...scores, school1_score: e.target.value })
                }
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label>{activeMatch.school2} Score:</label>
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
