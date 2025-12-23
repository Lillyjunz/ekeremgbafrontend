"use client";

import { Clock, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import pageStyles from "./events.module.css";

export default function EventsPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tournamentInfo, setTournamentInfo] = useState(null);

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
          name: capitalize(firstMatch.tournament_name),
          year: firstMatch.tournament_year,
          location: firstMatch.tournament_location,
          time: firstMatch.tournament_time,
          description: firstMatch.tournament_description,
        });

        // Process all matches
        const processedMatches = matchesData.map((item) => {
          const match = item.match;
          const school1Name = capitalize(match.school1_name);
          const school2Name = capitalize(match.school2_name);

          return {
            match_id: match.match_id,
            tournament_id: match.tournament_id,
            round: match.round || "First Round",
            school1: school1Name,
            school2: school2Name,
            school1_score: match.school1_score ?? 0,
            school2_score: match.school2_score ?? 0,
            school1Id: match.school1_id,
            school2Id: match.school2_id,
            school1Students:
              item.school1Students?.map((student) => ({
                ...student,
                fullname: capitalize(student.fullname),
              })) || [],
            school2Students:
              item.school2Students?.map((student) => ({
                ...student,
                fullname: capitalize(student.fullname),
              })) || [],
            winner: match.winner_id
              ? match.winner_id === match.school1_id
                ? school1Name
                : school2Name
              : null,
            isActive: match.isOngoing === "1" || match.isOngoing === "true",
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

    // Initial fetch
    fetchData();

    // Auto refresh every 2 minutes
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

  if (matches.length === 0)
    return (
      <>
        <Navbar />
        <div
          className={`${pageStyles.pageContainer} d-flex justify-content-center align-items-center`}
        >
          <div style={{ color: "#cbd5e1", fontSize: "1.125rem" }}>
            No active matches found.
          </div>
        </div>
        <Footer />
      </>
    );

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
              <span>Active Matches</span>
            </div>
            <h1 className={pageStyles.roundTitle}>
              {matches[0]?.round || "Tournament Matches"}
            </h1>

            {tournamentInfo && (
              <div
                className="mt-3"
                style={{ color: "#cbd5e1", fontSize: "0.95rem" }}
              >
                <div>
                  {tournamentInfo.name} {tournamentInfo.year}
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
