import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import styles from "./schools.module.css";

// components/RankingTable.js
export default function RankingTable() {
  const rankings = [
    { rank: 1, school: "The Pen College", score: 1589 },
    { rank: 2, school: "The Pen College", score: 1049 },
    { rank: 3, school: "The Pen College", score: 1049 },
    { rank: 4, school: "The Pen College", score: 1049 },
    { rank: 5, school: "The Pen College", score: 1049 },
    { rank: 6, school: "The Pen College", score: 1049 },
    { rank: 7, school: "The Pen College", score: 1049 },
    { rank: 8, school: "The Pen College", score: 1049 },
    { rank: 9, school: "The Pen College", score: 1049 },
    { rank: 10, school: "The Pen College", score: 1049 },
  ];

  return (
    <>
      <Navbar></Navbar>
      <div style={{ backgroundColor: "#fafafa" }}>
        <div className="container py-5">
          <div className={styles.rankingWrapper}>
            <table className="table mb-0">
              <thead>
                <tr className="text-muted">
                  <th>Ranking</th>
                  <th>School</th>
                  <th>Scores</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item) => (
                  <tr key={item.rank}>
                    <td>{item.rank}</td>
                    <td>{item.school}</td>
                    <td>{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}
