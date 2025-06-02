import styles from "./schools.module.css";

export default function Schools() {
  return (
    <div className="row">
      <div className="col-12">
        {/* Tournament Header */}
        <div
          className={`d-flex justify-content-between align-items-center ${styles.contentHeader}`}
        >
          <h2 className="fw-semi-bold">Schools</h2>

          <button className={`btn ${styles.createBtn}`}>Add Schools</button>
        </div>

        {/* Empty State */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <div className={styles.iconCircle}>
              <i className="bi bi-mortarboard"></i>
            </div>
          </div>

          <h3 className={styles.emptyTitle}>No School</h3>
          <p className={styles.emptyText}>
            You have not created any school competition
          </p>

          <button className={`btn ${styles.startBtn}`}>Add School</button>
        </div>
      </div>
    </div>
  );
}
