"use client";

import { Clock, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import pageStyles from "./events.module.css";

export default function EventsPage() {
  const [bracket, setBracket] = useState(null);
  const [schoolsMap, setSchoolsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMatch, setActiveMatch] = useState(null);

  // Helper function to capitalize text
  const capitalize = (text) => {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://api.ekeremgbaakpauche.com/api/admin/get-active-match"
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch active match");
        }

        const matchData = data.activeMatch;

        if (!matchData) {
          setBracket(null);
          setActiveMatch(null);
          setLoading(false);
          return;
        }

        // Capitalize school names
        const school1Name = capitalize(matchData.school1_name);
        const school2Name = capitalize(matchData.school2_name);

        // Build schools map
        const map = {
          [matchData.school1_id]: school1Name,
          [matchData.school2_id]: school2Name,
        };
        setSchoolsMap(map);

        // Build bracket structure
        const roundName = matchData.round || "Round of 32";
        setBracket({
          [roundName]: [
            {
              match_id: matchData.match_id,
              tournament_id: matchData.tournament_id,
              school1: school1Name,
              school2: school2Name,
              school1_score: matchData.school1_score ?? 0,
              school2_score: matchData.school2_score ?? 0,
              school1Id: matchData.school1_id,
              school2Id: matchData.school2_id,
              school1Students:
                matchData.school1Students?.map((student) => ({
                  ...student,
                  fullname: capitalize(student.fullname),
                })) || [],
              school2Students:
                matchData.school2Students?.map((student) => ({
                  ...student,
                  fullname: capitalize(student.fullname),
                })) || [],
              winner: matchData.winner_id ? map[matchData.winner_id] : null,
              isActive: matchData.isOngoing === "true",
              tournament_name: capitalize(matchData.tournament_name),
              tournament_year: matchData.tournament_year,
              tournament_location: matchData.tournament_location,
              tournament_time: matchData.tournament_time,
            },
          ],
        });

        setActiveMatch(matchData);
        setError("");
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load match data");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Auto refresh every 3 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 120000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <>
        <Navbar />
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
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div
          className={`${pageStyles.pageContainer} d-flex justify-content-center align-items-center`}
        >
          <div
            style={{ color: "#ef4444", fontSize: "1.25rem", fontWeight: "600" }}
          >
            {error}
          </div>
        </div>
        <Footer />
      </>
    );

  if (!bracket)
    return (
      <>
        <Navbar />
        <div
          className={`${pageStyles.pageContainer} d-flex justify-content-center align-items-center`}
        >
          <div style={{ color: "#cbd5e1", fontSize: "1.125rem" }}>
            No active match found.
          </div>
        </div>
        <Footer />
      </>
    );

  const currentRoundName = Object.keys(bracket)[0];
  const currentMatches = bracket[currentRoundName];

  return (
    <>
      <Navbar />
      <div className={pageStyles.pageContainer}>
        <div className={pageStyles.pageOverlay}></div>

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

            {currentMatches[0] && (
              <div
                className="mt-3"
                style={{ color: "#cbd5e1", fontSize: "0.95rem" }}
              >
                <div>
                  {currentMatches[0].tournament_name}{" "}
                  {currentMatches[0].tournament_year}
                </div>
                <div>
                  {currentMatches[0].tournament_location} •{" "}
                  {currentMatches[0].tournament_time}
                </div>
              </div>
            )}
          </div>

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

                        {match.school1Students?.length > 0 && (
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
                              <div key={student.id}>{student.fullname}</div>
                            ))}
                          </div>
                        )}
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

                        {match.school2Students?.length > 0 && (
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
                              <div key={student.id}>{student.fullname}</div>
                            ))}
                          </div>
                        )}
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
      </div>
      <Footer />
    </>
  );
}
