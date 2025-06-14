"use client";
import AddSchoolModal from "@/app/Components/addschool"; // 👈 new modal component
import { useState } from "react";
import styles from "./schools.module.css";

export default function Schools() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="row">
        <div className="col-12">
          {/* Tournament Header */}
          <div
            className={`d-flex justify-content-between align-items-center ${styles.contentHeader}`}
          >
            <h4 className="fw-semi-bold">Schools</h4>
            <button
              className={styles.createBtn}
              onClick={() => setShowModal(true)}
            >
              Add Schools
            </button>
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

            <button
              className={styles.startBtn}
              onClick={() => setShowModal(true)}
            >
              Add School
            </button>
          </div>
        </div>
      </div>

      {/* Right Slide Modal */}
      <AddSchoolModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
