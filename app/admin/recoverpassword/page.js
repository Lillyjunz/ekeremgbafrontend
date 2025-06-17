"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./recoverpassword.module.css";

export default function RecoverPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validatePasswords = () => {
    const newErrors = {};

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call to update password
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to login page with success message
      router.push("/admin/dashboard");
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Recover Password - Admin</title>
      </Head>

      <div className={`${styles.container} ${styles.bgLight}`}>
        <div className={styles.centerWrapper}>
          {/* Logo outside the form */}
          <div className="mb-4">
            <Image src="/images/logo.png" alt="Logo" width={120} height={80} />
          </div>

          {/* Recovery Form */}
          <div
            className={`shadow p-5 rounded-4 bg-white border ${styles.formContainer}`}
          >
            {/* Lock Icon */}
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#f8f9fa",
                  border: "2px solid #e9ecef",
                }}
              >
                <i
                  className="bi bi-lock"
                  style={{ fontSize: "24px", color: "#6c757d" }}
                ></i>
              </div>
            </div>

            <h2
              className="text-center fw-bold mb-2"
              style={{ color: "#606060" }}
            >
              Recover Password
            </h2>
            <p className="text-center text-muted mb-4">Set your new Password</p>

            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="form-label"
                  style={{ color: "#606060" }}
                >
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ced4da",
                    }}
                  >
                    <i
                      className={`bi bi-eye${showPassword ? "" : "-slash"}`}
                    ></i>
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="form-label"
                  style={{ color: "#606060" }}
                >
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    id="confirmPassword"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #ced4da",
                    }}
                  >
                    <i
                      className={`bi bi-eye${
                        showConfirmPassword ? "" : "-slash"
                      }`}
                    ></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="invalid-feedback d-block">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`btn text-white w-100 mb-3 ${styles.loginBtn}`}
                disabled={isLoading}
                style={{
                  backgroundColor: "#dc3545",
                  borderRadius: "25px",
                  padding: "12px",
                  fontWeight: "500",
                  border: "none",
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Updating Password...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-danger text-decoration-none"
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to login page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
