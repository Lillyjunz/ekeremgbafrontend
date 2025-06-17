"use client";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const MatchDetailsPanel = ({ isOpen, onClose, match }) => {
  const [currentModal, setCurrentModal] = useState("scoring");
  const [scores, setScores] = useState({
    team1: [
      { name: "Adebayo Malik", score: 10 },
      { name: "Iroka Grace", score: 10 },
    ],
    team2: [
      { name: "Gaffer Joy", score: 10 },
      { name: "Selomi Janelle", score: 10 },
    ],
  });

  const updateScore = (team, index, value) => {
    setScores((prev) => ({
      ...prev,
      [team]: prev[team].map((player, i) =>
        i === index ? { ...player, score: parseInt(value) || 0 } : player
      ),
    }));
  };

  const getTotalScore = (team) => {
    return scores[team].reduce((total, player) => total + player.score, 0);
  };

  const handleUpdateScore = () => {
    setCurrentModal("success");

    setTimeout(() => {
      setCurrentModal("updated");
    }, 1500); // Show success for 1.5s before transitioning
  };

  const handlePreviewScoreboard = () => {
    console.log("Preview scoreboard clicked");
  };

  const handleContinue = () => {
    setCurrentModal("scoring");
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !match) return null;

  return (
    <div className="tournament-modal-overlay" onClick={onClose}>
      <div
        className={`tournament-modal slide-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* SCORING MODAL */}
        {currentModal === "scoring" && (
          <>
            <div className="tournament-modal-header">
              <button className="tournament-modal-close" onClick={onClose}>
                <X />
              </button>
              <div className="tournament-teams-container">
                <div>
                  <div className="tournament-team-circle ms-5"></div>
                  <div className="tournament-team-name">Legend High School</div>
                </div>
                <div className="tournament-score-display">
                  {getTotalScore("team1")} - {getTotalScore("team2")}
                </div>
                <div>
                  <div className="tournament-team-circle ms-5"></div>
                  <div className="tournament-team-name">State High School</div>
                </div>
              </div>
            </div>

            <div className="tournament-modal-body">
              <div className="tournament-topic-section">
                <label className="tournament-topic-label">Topic</label>
                <div className="tournament-topic-text">
                  Education is better Than Medicine and Surgery
                </div>
              </div>

              <div className="tournament-scores-section">
                <h3 className="tournament-scores-label">Scores</h3>
                <div className="tournament-scores-grid">
                  <div>
                    {scores.team1.map((player, index) => (
                      <div key={index} className="tournament-player-row">
                        <span className="tournament-player-name">
                          {player.name}
                        </span>
                        <input
                          type="number"
                          className="tournament-score-input"
                          value={player.score}
                          onChange={(e) =>
                            updateScore("team1", index, e.target.value)
                          }
                          min="0"
                          max="100"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    {scores.team2.map((player, index) => (
                      <div key={index} className="tournament-player-row">
                        <span className="tournament-player-name">
                          {player.name}
                        </span>
                        <input
                          type="number"
                          className="tournament-score-input"
                          value={player.score}
                          onChange={(e) =>
                            updateScore("team2", index, e.target.value)
                          }
                          min="0"
                          max="100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="tournament-actionss full-width">
              <button
                className="tournamentt-btn tournament-btn-primary full-width"
                onClick={handleUpdateScore}
              >
                Update Score
              </button>
            </div>
          </>
        )}

        {/* SUCCESS MODAL */}
        {currentModal === "success" && (
          <div className="tournament-success-modal no-buttons">
            <div className="tournament-success-icon">
              <Check color="white" size={32} />
            </div>
            <h2 className="tournament-success-title">
              Score Updated Successfully!
            </h2>
            <p className="tournament-success-message">
              Your score has been updated and saved.
            </p>
          </div>
        )}

        {/* UPDATED SCORE MODAL */}
        {currentModal === "updated" && (
          <>
            <div className="tournament-modal-header">
              <button className="tournament-modal-close" onClick={onClose}>
                <X />
              </button>
              <div className="tournament-teams-container">
                <div>
                  <div className="tournament-team-circle ms-5"></div>
                  <div className="tournament-team-name">Legend High School</div>
                </div>
                <div className="tournament-score-display">
                  {getTotalScore("team1")} - {getTotalScore("team2")}
                </div>
                <div>
                  <div className="tournament-team-circle ms-5"></div>
                  <div className="tournament-team-name">State High School</div>
                </div>
              </div>
            </div>

            <div className="tournament-modal-body">
              <div className="tournament-scores-section">
                <h3 className="tournament-scores-label">Updated Scores</h3>
                <div className="tournament-scores-grid">
                  <div>
                    {scores.team1.map((player, index) => (
                      <div key={index} className="tournament-player-row">
                        <span className="tournament-player-name">
                          {player.name}
                        </span>
                        <span>{player.score}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    {scores.team2.map((player, index) => (
                      <div key={index} className="tournament-player-row">
                        <span className="tournament-player-name">
                          {player.name}
                        </span>
                        <span>{player.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="tournament-actions">
              <button
                className="tournament-btn tournament-btn-primary"
                onClick={() => setCurrentModal("scoring")}
              >
                Update Score
              </button>
              <button
                className="tournament-btn tournament-btn-secondary"
                onClick={handlePreviewScoreboard}
              >
                <Link href="/admin/scoreboard">Preview Scoreboard</Link>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchDetailsPanel;
