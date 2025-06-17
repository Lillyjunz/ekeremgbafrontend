// app/scoreboard/page.jsx
"use client";

import { ArrowLeft, Info, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./scoreboard.module.css";

export default function ScoreboardPage() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className={styles.container}>
      <button className={styles.backButton}>
        <Link href="/admin/dashboard/tournament/tournament2">
          <ArrowLeft size={16} />
          &nbsp;Go back to home
        </Link>
      </button>

      <div className={styles.topicWrapper}>
        <p className={styles.topicLabel}>TOPIC</p>
        <h1 className={styles.topicText}>
          Education is better Than Medicine and Surgery
        </h1>
      </div>

      <div className={styles.scoreboardBox}>
        <div className={styles.matchup}>
          <span className={styles.teamLeft}>The Legend High School</span>
          <span className={styles.vs}>VS</span>
          <span className={styles.teamRight}>State High School, Ijanikin</span>
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.teamScores}>
            <div className={styles.teamColumn}>
              <h5>Students</h5>
              <ul>
                <li>Rohit</li>
                <li>Shubham</li>
                <li>Girish</li>
                <li>Rahul</li>
                <li>Raina</li>
                <li>Yash</li>
              </ul>
            </div>
            <div className={styles.teamColumn}>
              <h5>Score</h5>
              <ul>
                <li>05</li>
                <li>03</li>
                <li>05</li>
                <li>04</li>
                <li>05</li>
                <li>80</li>
              </ul>
            </div>

            <div className={styles.centerScore}>100 : 101</div>

            <div className={styles.teamColumn}>
              <h5>Students</h5>
              <ul>
                <li>Rohit</li>
                <li>Shubham</li>
                <li>Girish</li>
                <li>Rahul</li>
                <li>Raina</li>
                <li>Yash</li>
              </ul>
            </div>
            <div className={styles.teamColumn}>
              <h5>Score</h5>
              <ul>
                <li>05</li>
                <li>03</li>
                <li>05</li>
                <li>04</li>
                <li>05</li>
                <li>80</li>
              </ul>
            </div>
          </div>

          <div className={styles.timer}>Time : 25:99</div>
        </div>
      </div>

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
                <Info size={18} />
                Instructions
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

      {/* Overlay for mobile popup */}
      {showInstructions && (
        <div
          className={styles.overlay}
          onClick={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
}
