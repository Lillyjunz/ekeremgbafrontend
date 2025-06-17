// components/ChangePasswordModal.js
"use client";

import { useState } from "react";
import styles from "./changepassword.module.css";

export default function ChangePasswordModal({ onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } else {
      alert("Passwords do not match.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h5>Change Password</h5>
          <button onClick={onClose} className={styles.closeBtn}>
            &times;
          </button>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className={styles.modalForm}>
            <label>New Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <i
                className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowNewPassword((prev) => !prev)}
              />
            </div>

            <label>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
              <i
                className={`bi ${
                  showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                }`}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit">Save Password</button>
            </div>
          </form>
        ) : (
          <p className={styles.success}>Password updated successfully!</p>
        )}
      </div>
    </div>
  );
}
