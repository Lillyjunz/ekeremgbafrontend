"use client";

import { Clock, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import styles from "./events.module.css";

export default function EventsPage() {
  const [token, setToken] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [schoolsMap, setSchoolsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMatch, setActiveMatch] = useState(null);

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
              school1_score: demoData.activeMatch.school1_score,
              school2_score: demoData.activeMatch.school2_score,
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

  if (loading)
    return (
      <div
        className={styles.pageContainer}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#cbd5e1" }}>
          Loading scoreboard...
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className={styles.pageContainer}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#ef4444",
        }}
      >
        {error}
      </div>
    );

  if (!bracket)
    return (
      <div
        className={styles.pageContainer}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#cbd5e1",
        }}
      >
        No active match found.
      </div>
    );

  const currentRoundName = Object.keys(bracket)[0];
  const currentMatches = bracket[currentRoundName];

  return (
    <>
      <Navbar></Navbar>
      <div className={styles.pageContainer}>
        <div className={styles.pageOverlay}></div>

        <div
          className="container py-5"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="text-center mb-5">
            <div className={styles.roundBadge}>
              <Trophy size={20} /> Current Round
            </div>
            <h1 className={styles.roundTitle}>{currentRoundName}</h1>
          </div>

          <div className="row g-4 justify-content-center">
            {currentMatches.map((match) => {
              const school1Score = Number(match.school1_score) || 0;
              const school2Score = Number(match.school2_score) || 0;
              const isLive = match.isActive && match.winner === null;

              return (
                <div key={match.match_id} className="col-12 col-xl-10">
                  <div
                    className={`${styles.matchCard} ${
                      isLive ? styles.matchCardLive : ""
                    }`}
                  >
                    {isLive && (
                      <div className={styles.liveBadge}>
                        <div className={styles.pulse}></div> LIVE
                      </div>
                    )}

                    <div className="text-center mb-4">
                      <span className={styles.matchBadge}>
                        <Users size={16} /> Match {match.match_id}
                      </span>
                      {isLive && (
                        <span className={styles.inProgressBadge}>
                          <Zap size={16} /> In Progress
                        </span>
                      )}
                    </div>

                    <div className="row align-items-center text-center g-4">
                      <div className="col-12 col-md-5">
                        <h3
                          className={`${styles.schoolName} ${
                            school1Score > school2Score
                              ? styles.schoolNameWinning
                              : ""
                          }`}
                        >
                          {match.school1}
                        </h3>
                        <div
                          className={`${styles.scoreDisplay} ${
                            school1Score > school2Score
                              ? styles.scoreDisplayWinning
                              : ""
                          }`}
                        >
                          {school1Score}
                        </div>
                      </div>

                      <div className="col-12 col-md-2">
                        <div className={styles.vsCircle}>VS</div>
                        {isLive && (
                          <div
                            className="mt-3"
                            style={{
                              color: "#4ade80",
                              fontSize: "0.875rem",
                              fontWeight: "600",
                            }}
                          >
                            <Clock size={14} /> Ongoing
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-5">
                        <h3
                          className={`${styles.schoolName} ${
                            school2Score > school1Score
                              ? styles.schoolNameWinning
                              : ""
                          }`}
                        >
                          {match.school2}
                        </h3>
                        <div
                          className={`${styles.scoreDisplay} ${
                            school2Score > school1Score
                              ? styles.scoreDisplayWinning
                              : ""
                          }`}
                        >
                          {school2Score}
                        </div>
                      </div>
                    </div>

                    {match.winner && (
                      <div className="text-center mt-4">
                        <span className={styles.winnerBadge}>
                          <Trophy size={20} /> Winner: {match.winner}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
