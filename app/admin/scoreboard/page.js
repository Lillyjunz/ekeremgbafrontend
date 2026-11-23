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
  const [activeMatch, setActiveMatch] = useState(null);

  const [scores, setScores] = useState({
    school1_score: "",
    school2_score: "",
    winnerId: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const tournamentId = 2;

  // Fetch tournament bracket
  const fetchBracket = async () => {
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5100/api/admin/bracket/${tournamentId}`,
      );

      // Read response as text first to prevent JSON parsing errors
      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Invalid bracket API response:", text);

        // Backend returned plain text instead of JSON
        setBracket({});
        setError("");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch bracket data");
      }

      // If bracket is missing or empty, display no ongoing event
      setBracket(data.bracket || {});
    } catch (err) {
      console.error("Fetch bracket error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + auto-refresh every 5 seconds
  useEffect(() => {
    fetchBracket();

    const interval = setInterval(fetchBracket, 5000);

    return () => clearInterval(interval);
  }, []);

  // Open score recording modal
  const handleOpenScoreForm = (match) => {
    setActiveMatch(match);

    setScores({
      school1_score: "",
      school2_score: "",
      winnerId: "",
    });
  };

  // Submit match scores
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
        `http://localhost:5100/api/admin/match/${activeMatch.match_id}/winner/tournament/${tournamentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            winnerId: Number(scores.winnerId),
            school1_score: Number(scores.school1_score),
            school2_score: Number(scores.school2_score),
          }),
        },
      );

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || "Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to record scores");
      }

      alert(data.message || "Scores recorded successfully");

      setActiveMatch(null);

      // Refresh scoreboard after submitting scores
      await fetchBracket();
    } catch (err) {
      console.error("Record scores error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading scoreboard...</p>;
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        <p>{error}</p>
        <button onClick={fetchBracket}>Retry</button>
      </div>
    );
  }

  // No bracket data
  if (!bracket) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3>No Ongoing Event</h3>
        <p>There are currently no matches available.</p>
      </div>
    );
  }

  // Determine current round
  const currentRoundName = Object.keys(bracket).find((round) =>
    bracket[round]?.some((match) => match.winner === null),
  );

  // Only display matches that haven't been completed
  const currentMatches = currentRoundName
    ? bracket[currentRoundName].filter((match) => match.winner === null)
    : [];

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <button className={styles.backButton}>
        <Link href="/admin/dashboard">
          <ArrowLeft size={16} />
          &nbsp;Go back to home
        </Link>
      </button>

      {/* Current Round */}
      <div className={styles.topicWrapper}>
        <p className={styles.topicLabel}>CURRENT ROUND</p>

        <h1 className={styles.topicText}>
          {currentRoundName || "No Ongoing Event"}
        </h1>
      </div>

      {/* No Ongoing Matches */}
      {currentMatches.length === 0 && (
        <div className={styles.noMatches}>
          <h3>No Ongoing Event</h3>
          <p>There are currently no matches available for scoring.</p>
        </div>
      )}

      {/* Match Scoreboards */}
      {currentMatches.map((match) => (
        <div key={match.match_id} className={styles.scoreboardBox}>
          {/* Matchup */}
          <div className={styles.matchup}>
            <span className={styles.teamLeft}>{match.school1}</span>

            <span className={styles.vs}>VS</span>

            <span className={styles.teamRight}>{match.school2}</span>
          </div>

          {/* Scores Section */}
          <div className={styles.scoreSection}>
            <div className={styles.teamScores}>
              {/* School 1 Students */}
              <div className={styles.teamColumn}>
                <h5>Students</h5>

                <ul>
                  {match.school1_students?.length > 0 ? (
                    match.school1_students.map((s) => (
                      <li key={s.id}>{s.name}</li>
                    ))
                  ) : (
                    <li>Student list not available</li>
                  )}
                </ul>
              </div>

              {/* School 1 Scores */}
              <div className={styles.teamColumn}>
                <h5>Score</h5>

                <ul>
                  {match.school1_students?.length > 0 ? (
                    match.school1_students.map((s) => (
                      <li key={s.id}>{s.score || 0}</li>
                    ))
                  ) : (
                    <li>0</li>
                  )}
                </ul>
              </div>

              {/* Total Score */}
              <div className={styles.centerScore}>
                {match.school1_total || 0} : {match.school2_total || 0}
              </div>

              {/* School 2 Students */}
              <div className={styles.teamColumn}>
                <h5>Students</h5>

                <ul>
                  {match.school2_students?.length > 0 ? (
                    match.school2_students.map((s) => (
                      <li key={s.id}>{s.name}</li>
                    ))
                  ) : (
                    <li>Student list not available</li>
                  )}
                </ul>
              </div>

              {/* School 2 Scores */}
              <div className={styles.teamColumn}>
                <h5>Score</h5>

                <ul>
                  {match.school2_students?.length > 0 ? (
                    match.school2_students.map((s) => (
                      <li key={s.id}>{s.score || 0}</li>
                    ))
                  ) : (
                    <li>0</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Timer */}
            <div className={styles.timer}>Time : {match.timer || "00:00"}</div>
          </div>

          {/* Record Scores Button */}
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
            {/* Winner */}
            <div style={{ marginBottom: "1rem" }}>
              <label>Winner:</label>

              <select
                value={scores.winnerId}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    winnerId: e.target.value,
                  })
                }
              >
                <option value="">Select Winner</option>
                <option value={1}>{activeMatch.school1}</option>
                <option value={2}>{activeMatch.school2}</option>
              </select>
            </div>

            {/* School 1 Score */}
            <div style={{ marginBottom: "1rem" }}>
              <label>{activeMatch.school1} Score:</label>

              <input
                type="number"
                min="0"
                value={scores.school1_score}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    school1_score: e.target.value,
                  })
                }
              />
            </div>

            {/* School 2 Score */}
            <div style={{ marginBottom: "1rem" }}>
              <label>{activeMatch.school2} Score:</label>

              <input
                type="number"
                min="0"
                value={scores.school2_score}
                onChange={(e) =>
                  setScores({
                    ...scores,
                    school2_score: e.target.value,
                  })
                }
              />
            </div>

            {/* Submit */}
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

      {/* Instructions Overlay */}
      {showInstructions && (
        <div
          className={styles.overlay}
          onClick={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
}
