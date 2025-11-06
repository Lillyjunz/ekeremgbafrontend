"use client";
import styles from "./report.module.css";

const Report = () => {
  const teamData = []; // empty for now

  return (
    <div className="container-fluid px-4 py-4">
      {/* Header with Export Button */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between">
          <h2>Report</h2>
          <button className={styles.createBtn}>Export</button>
        </div>
      </div>

      {/* Empty State */}
      {teamData.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyStateTitle}>No Reports Yet</h3>
          <p className={styles.emptyStateText}>
            There are no reports to display at the moment. Once the data is
            available, it will appear here.
          </p>
        </div>
      ) : (
        // Your table code here when teamData has items
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className={`table ${styles.tournamentTable}`}>
                <thead>
                  <tr>
                    <th className={styles.rankingCol}>Ranking</th>
                    <th className={styles.nameCol}>Name</th>
                    <th className={styles.representativeCol}>Representative</th>
                    <th className={styles.scoresCol}>Scores</th>
                    <th className={styles.overallCol}>Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.map((team, index) => (
                    <tr key={index} className={styles.teamRow}>
                      <td className={styles.rankingCell}>{team.ranking}</td>
                      <td className={styles.nameCell}>{team.name}</td>
                      <td className={styles.representativeCell}>
                        <div className={styles.representativesList}>
                          {team.representatives.map((rep, repIndex) => (
                            <div
                              key={repIndex}
                              className={styles.representativeName}
                            >
                              {rep}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className={styles.scoresCell}>{team.scores}</td>
                      <td className={styles.overallCell}>{team.overall}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
