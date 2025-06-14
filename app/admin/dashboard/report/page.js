"use client";
import styles from "./report.module.css";

const Report = () => {
  const teamData = [
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
  ];

  return (
    <div className="container-fluid px-4 py-4">
      {/* Header with Export Button */}
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-between">
          <h2>Report</h2>
          <button className={styles.createBtn}>Export</button>
        </div>
      </div>

      {/* Tournament Table */}
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

      {/* Pagination */}
      <div className="row mt-4">
        <div className="col-12">
          <div className={styles.paginationContainer}>
            <div className={styles.entriesInfo}>
              <div className={styles.entriesDropdown}>
                <select className={`form-select ${styles.entriesSelect}`}>
                  <option value="10">10 Entries</option>
                  <option value="25">25 Entries</option>
                  <option value="50">50 Entries</option>
                </select>
              </div>
              <span className={styles.showingText}>
                Showing 1 to 10 of 95 entries.
              </span>
            </div>

            <nav aria-label="Table pagination">
              <ul className={`pagination ${styles.pagination}`}>
                <li className={`page-item ${styles.pageItem}`}>
                  <a
                    className={`page-link ${styles.pageLink}`}
                    href="#"
                    aria-label="Previous"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li className={`page-item active ${styles.pageItem}`}>
                  <a
                    className={`page-link ${styles.pageLink} ${styles.active}`}
                    href="#"
                  >
                    1
                  </a>
                </li>
                <li className={`page-item ${styles.pageItem}`}>
                  <a className={`page-link ${styles.pageLink}`} href="#">
                    2
                  </a>
                </li>
                <li className={`page-item ${styles.pageItem}`}>
                  <a className={`page-link ${styles.pageLink}`} href="#">
                    3
                  </a>
                </li>
                <li className={`page-item ${styles.pageItem}`}>
                  <span
                    className={`page-link ${styles.pageLink} ${styles.ellipsis}`}
                  >
                    ...
                  </span>
                </li>
                <li className={`page-item ${styles.pageItem}`}>
                  <a className={`page-link ${styles.pageLink}`} href="#">
                    5
                  </a>
                </li>
                <li className={`page-item ${styles.pageItem}`}>
                  <a
                    className={`page-link ${styles.pageLink}`}
                    href="#"
                    aria-label="Next"
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
