"use client";

import MatchDetailsPanel from "@/app/Components/matchdetails";
import Link from "next/link";
import { useState } from "react";
import styles from "./tournament2.module.css";

export default function TournamentBracket() {
  const [selectedRound, setSelectedRound] = useState("Round of 16");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'groups'
  const [activeMatch, setActiveMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample tournament data
  const tournamentData = {
    "Round of 16": [
      {
        id: 1,
        match: "Match 1, Round 1",
        team1: "The Pen College",
        team2: "Top Most School",
        time: "12:30PM",
        score1: "-",
        score2: "-",
      },
      {
        id: 2,
        match: "Match 1, Round 1",
        team1: "The Pen College",
        team2: "Top Most School",
        time: "12:30PM",
        score1: "-",
        score2: "-",
      },
      {
        id: 3,
        match: "Match 1, Round 1",
        team1: "The Pen College",
        team2: "Top Most School",
        time: "12:30PM",
        score1: "-",
        score2: "-",
      },
      {
        id: 4,
        match: "Match 1, Round 1",
        team1: "The Pen College",
        team2: "Top Most School",
        time: "12:30PM",
        score1: "-",
        score2: "-",
      },
      {
        id: 5,
        match: "Match 1, Round 1",
        team1: "The Pen College",
        team2: "Top Most School",
        time: "12:30PM",
        score1: "-",
        score2: "-",
      },
      {
        id: 6,
        match: "Match 1, Round 1",
        team1: "The Pen College",
        team2: "Top Most School",
        time: "12:30PM",
        score1: "-",
        score2: "-",
      },
    ],
    Quarterfinals: [
      {
        id: 7,
        match: "Match 1, Quarterfinal",
        team1: "TBD",
        team2: "TBD",
        time: "TBD",
        score1: "-",
        score2: "-",
      },
      {
        id: 8,
        match: "Match 2, Quarterfinal",
        team1: "TBD",
        team2: "TBD",
        time: "TBD",
        score1: "-",
        score2: "-",
      },
      {
        id: 9,
        match: "Match 3, Quarterfinal",
        team1: "TBD",
        team2: "TBD",
        time: "TBD",
        score1: "-",
        score2: "-",
      },
      {
        id: 10,
        match: "Match 4, Quarterfinal",
        team1: "TBD",
        team2: "TBD",
        time: "TBD",
        score1: "-",
        score2: "-",
      },
    ],
    Semifinal: [
      {
        id: 11,
        match: "Match 1, Semifinal",
        team1: "TBD",
        team2: "TBD",
        time: "TBD",
        score1: "-",
        score2: "-",
      },
      {
        id: 12,
        match: "Match 2, Semifinal",
        team1: "TBD",
        team2: "TBD",
        time: "TBD",
        score1: "-",
        score2: "-",
      },
    ],
    Final: [
      {
        id: 13,
        match: "Final Match",
        team1: "TBD",
        team2: "TBD",
        time: "TBD",
        score1: "-",
        score2: "-",
      },
    ],
  };

  const rounds = ["Round of 16", "Quarterfinals", "Semifinal", "Final"];

  const currentMatches = tournamentData[selectedRound] || [];

  return (
    <div className={styles.tournamentContainer}>
      {/* Tournament Header */}
      <div className={styles.tournamentHeader}>
        <div className={styles.tournamentTitle}>
          <div className="dropdown">
            <button
              className={`btn dropdown-toggle ${styles.tournamentDropdown}`}
              type="button"
              data-bs-toggle="dropdown"
            >
              Ekeremgba - Akpauche 2025
            </button>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Ekeremgba - Akpauche 2025
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Tournament 2024
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Championship 2023
                </a>
              </li>
            </ul>
          </div>
        </div>
        <button className={styles.createTournamentBtn}>
          Create Tournament
        </button>
      </div>

      {/* Round Navigation */}
      <div className={styles.roundNavigation}>
        <div className={styles.roundTabs}>
          {rounds.map((round) => (
            <button
              key={round}
              className={`${styles.roundTab} ${
                selectedRound === round ? styles.roundTabActive : ""
              }`}
              onClick={() => setSelectedRound(round)}
            >
              {round}
            </button>
          ))}
        </div>
        <button
          className={styles.viewGroupsBtn}
          onClick={() => setViewMode(viewMode === "list" ? "groups" : "list")}
        >
          <Link href="/admin/dashboard/tournament">
            <i className="bi bi-grid-3x3-gap me-2"></i>
            View Groups
          </Link>
        </button>
      </div>

      {/* Matches Grid */}
      <div className={styles.matchesGrid}>
        {currentMatches.map((match) => (
          <div
            onClick={() => setIsModalOpen(true)}
            key={match.id}
            className={styles.matchCard}
          >
            <div className={styles.matchHeader}>
              <span className={styles.matchTitle}>{match.match}</span>
              <button className={styles.matchOptions}>
                <i className="bi bi-three-dots"></i>
              </button>
            </div>

            <div className={styles.matchContent}>
              <div className={styles.team}>
                <span className={styles.teamName}>{match.team1}</span>
                <span className={styles.teamScore}>{match.score1}</span>
              </div>

              <div className={styles.vsSection}>
                <span className={styles.vsText}>VS</span>
              </div>

              <div className={styles.team}>
                <span className={styles.teamName}>{match.team2}</span>
                <span className={styles.teamScore}>{match.score2}</span>
              </div>
            </div>

            <div className={styles.matchTime}>
              <i className="bi bi-clock text-danger me-2"></i>
              <span className="text-danger">{match.time}</span>
            </div>
          </div>
        ))}
      </div>

      <MatchDetailsPanel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        match={tournamentData}
      />
    </div>
  );
}
