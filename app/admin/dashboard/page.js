import styles from "./dashboard.module.css";

export default function Dashboard() {
  return (
    <div className="row">
      <div className="col-12">
        {/* Tournament Header */}
        <div
          className={`d-flex justify-content-between align-items-center ${styles.contentHeader}`}
        >
          <div className={styles.tournamentSelector}>
            <div
              className="dropdown p-2"
              style={{
                border: "2px solid #f2f2f2",
                borderRadius: "15px",
                backgroundColor: "#fff",
              }}
            >
              <button
                className={`btn  ${styles.tournamentBtn}`}
                type="button"
                data-bs-toggle="dropdown"
              >
                Ekeremgba - Akpauche 2025
                <i className="bi bi-chevron-down ms-2"></i>
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

          <button className={`btn ${styles.createBtn}`}>
            Create Tournament
          </button>
        </div>

        {/* Empty State */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <div className={styles.iconCircle}>
              <i className="bi bi-trophy"></i>
            </div>
          </div>

          <h3 className={styles.emptyTitle}>No Tournament</h3>
          <p className={styles.emptyText}>
            You have not created any competition
          </p>

          <button className={`btn ${styles.startBtn}`}>
            Start a Competition
          </button>
        </div>
      </div>
    </div>
  );
}
