"use client";

export default function MatchDetailsPanel({ match, onClose }) {
  if (!match) return null;

  return (
    <div className="match-panel-overlay" onClick={onClose}>
      <div className="match-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="match-header">
          <h5>
            {match.team1} <span>VS</span> {match.team2}
          </h5>
          <p>{match.time} | Lagos, Nigeria</p>
        </div>

        <div className="topic-section">
          <label>Topic</label>
          <textarea
            defaultValue="Education is better Than Medicine and Surgery"
            className="form-control"
            rows={2}
          />
        </div>

        <div className="scores-section">
          <h6>Scores</h6>
          <div className="score-row">
            <input
              className="form-control"
              placeholder="Adebayo Malik"
              defaultValue="10"
            />
            <input
              className="form-control"
              placeholder="Gaffar Joy"
              defaultValue="10"
            />
          </div>
          <div className="score-row">
            <input
              className="form-control"
              placeholder="Iroko Grace"
              defaultValue="10"
            />
            <input
              className="form-control"
              placeholder="Selom Janelle"
              defaultValue="10"
            />
          </div>
          <div className="score-row">
            <input
              className="form-control"
              placeholder="Iroko Grace"
              defaultValue="10"
            />
            <input
              className="form-control"
              placeholder="Selom Janelle"
              defaultValue="10"
            />
          </div>
        </div>

        <button className="update-btn">Update Score</button>
      </div>
    </div>
  );
}
