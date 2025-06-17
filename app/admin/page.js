"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./admin.module.css";

export default function LoginPage() {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for success message on component mount
  useEffect(() => {
    const resetParam = searchParams.get("reset");
    if (resetParam === "success") {
      setShowSuccessMessage(true);
      // Remove the query parameter after showing the message
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace("/admin/login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotModal(false);
      setShowSuccessModal(true);

      // Auto redirect to recover password page after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push("/admin/recoverpassword");
      }, 3000);
    }, 1500);
  };

  const handleResend = () => {
    setShowSuccessModal(false);
    setShowForgotModal(true);
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>

      <div className={`${styles.container} ${styles.bgLight}`}>
        <div className={styles.centerWrapper}>
          {/* Logo outside the form */}
          <div className="mb-4">
            <Image src="/images/logo.png" alt="Logo" width={120} height={80} />
          </div>

          {/* Login Form */}
          <div
            className={`shadow p-5 rounded-4 bg-white border ${styles.formContainer}`}
          >
            {/* Success Message Alert */}
            {showSuccessMessage && (
              <div className="alert alert-success mb-4" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                Password updated successfully! You can now login with your new
                password.
              </div>
            )}

            <h2
              className="text-center fw-bold mb-2"
              style={{ color: "#606060" }}
            >
              Welcome Admin!
            </h2>
            <p className="text-center text-muted mb-4">
              Kindly fill in your details to login to your account
            </p>

            <form>
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ color: "#606060" }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

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
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="********"
                  />
                  <span className="input-group-text bg-white">
                    <i className="bi bi-eye-slash"></i>
                  </span>
                </div>
              </div>

              <div className="mb-3 text-end">
                <button
                  type="button"
                  className="btn btn-link text-danger text-decoration-none p-0"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot password?
                </button>
              </div>

              <Link href="/admin/dashboard">
                <button
                  type="submit"
                  className={`btn text-white w-100 ${styles.loginBtn}`}
                >
                  Login
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="modal-body p-5 text-center">
                {/* Logo */}
                <div className="mb-4">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={80}
                    height={55}
                  />
                </div>

                {/* Lock Icon */}
                <div className="mb-4">
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

                <h4 className="fw-bold mb-3" style={{ color: "#606060" }}>
                  Forgot Password?
                </h4>

                <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
                  You don't need to worry, we will send a reset instruction.
                </p>

                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4 text-start">
                    <label
                      htmlFor="forgotEmail"
                      className="form-label text-muted"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="forgotEmail"
                      placeholder="abc@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e9ecef",
                        padding: "12px 15px",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.loginBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Sending...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  className="btn btn-link text-danger text-decoration-none p-0 mt-2"
                  onClick={() => setShowForgotModal(false)}
                  style={{ fontSize: "14px" }}
                >
                  <i className="bi bi-arrow-left me-1 "></i>
                  Back to login page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="modal-body p-5 text-center">
                {/* Email Icon */}
                <div className="mb-4">
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "#e3f2fd",
                    }}
                  >
                    <i
                      className="bi bi-envelope"
                      style={{ fontSize: "32px", color: "#1976d2" }}
                    ></i>
                  </div>
                </div>

                <h4 className="fw-bold mb-3" style={{ color: "#606060" }}>
                  Check your inbox!
                </h4>

                <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
                  We have sent password recovery
                  <br />
                  instructions to your mail.
                </p>

                {/* Auto redirect message */}
                <div className="mb-3">
                  <small className="text-info">
                    <i className="bi bi-info-circle me-1"></i>
                    Redirecting to password reset page in 3 seconds...
                  </small>
                </div>

                <p
                  className="mb-0"
                  style={{ fontSize: "14px", color: "#606060" }}
                >
                  Didn't get a mail?
                  <button
                    type="button"
                    className="btn btn-link text-danger text-decoration-none p-0 ms-1"
                    onClick={handleResend}
                    style={{ fontSize: "14px", fontWeight: "500" }}
                  >
                    Resend
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
