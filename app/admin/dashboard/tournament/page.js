"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./tournament.module.css";

export default function TournamentPage() {
  const [activeGroup, setActiveGroup] = useState("Group 1");

  // Sample tournament data
  const groups = ["Group 1", "Group 2", "Group 3", "Group 4"];

  const tournamentData = {
    "Group 1": [
      {
        ranking: 1,
        name: "The Pen College",
        representatives: [
          "Annette Black",
          "Kathryn Murphy",
          "Arlene McCoy",
          "Emeka Godson",
        ],
        scores: "-",
        overall: "-",
      },
      {
        ranking: 2,
        name: "The Pen College",
        representatives: [
          "Annette Black",
          "Kathryn Murphy",
          "Arlene McCoy",
          "Emeka Godson",
        ],
        scores: "-",
        overall: "-",
      },
      {
        ranking: 3,
        name: "The Pen College",
        representatives: [
          "Annette Black",
          "Kathryn Murphy",
          "Arlene McCoy",
          "Emeka Godson",
        ],
        scores: "-",
        overall: "-",
      },
      {
        ranking: 4,
        name: "The Pen College",
        representatives: [
          "Annette Black",
          "Kathryn Murphy",
          "Arlene McCoy",
          "Emeka Godson",
        ],
        scores: "-",
        overall: "-",
      },
    ],
    "Group 2": [
      {
        ranking: 1,
        name: "High School Academy",
        representatives: [
          "John Doe",
          "Jane Smith",
          "Mike Johnson",
          "Sarah Wilson",
        ],
        scores: "-",
        overall: "-",
      },
      {
        ranking: 2,
        name: "Elite Learning Center",
        representatives: [
          "David Brown",
          "Lisa Garcia",
          "Robert Miller",
          "Amanda Davis",
        ],
        scores: "-",
        overall: "-",
      },
    ],
    "Group 3": [],
    "Group 4": [],
  };

  const currentGroupData = tournamentData[activeGroup] || [];

  return (
    <div className={styles.tournamentContainer}>
      {/* Group Tabs */}
      <div className={styles.groupTabs}>
        {groups.map((group) => (
          <button
            key={group}
            className={`${styles.groupTab} ${
              activeGroup === group ? styles.groupTabActive : ""
            }`}
            onClick={() => setActiveGroup(group)}
          >
            {group}
          </button>
        ))}

        <button className={styles.proceedBtn}>
          <Link href="/admin/dashboard/tournament/tournament2">
            Proceed to Tournament
          </Link>
        </button>
      </div>

      {/* Tournament Table */}
      <div className={styles.tournamentTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Ranking</div>
          <div className={styles.headerCell}>Name</div>
          <div className={styles.headerCell}>Representative</div>
          <div className={styles.headerCell}>Scores</div>
          <div className={styles.headerCell}>Overall</div>
        </div>

        <div className={styles.tableBody}>
          {currentGroupData.length > 0 ? (
            currentGroupData.map((school, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <span className={styles.ranking}>{school.ranking}</span>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.schoolName}>{school.name}</span>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.representatives}>
                    {school.representatives.map((rep, repIndex) => (
                      <div key={repIndex} className={styles.representative}>
                        {rep}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.scores}>{school.scores}</span>
                </div>
                <div className={styles.tableCell}>
                  <span className={styles.overall}>{school.overall}</span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyGroup}>
              <p>No schools assigned to {activeGroup}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
