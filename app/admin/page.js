"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import styles from "./admin.module.css";

function LoginPageContent() {
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ New state for password visibility
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const resetParam = searchParams.get("reset");
    if (resetParam === "success") {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        router.replace("/admin/login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  // ✅ Handle login API call
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        "http://api.ekeremgbaakpauche.com/api/admin/admin-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Save token
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }

      // ✅ Redirect
      router.push("/admin/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotModal(false);
      setShowSuccessModal(true);
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

  // ✅ Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={`${styles.container} ${styles.bgLight}`}>
        <div className={styles.centerWrapper}>
          <div className="mb-4">
            <Image src="/images/logo.png" alt="Logo" width={120} height={80} />
          </div>

          <div
            className={`shadow p-5 rounded-4 bg-white border ${styles.formContainer}`}
          >
            {showSuccessMessage && (
              <div className="alert alert-success mb-4" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                Password updated successfully! You can now login with your new
                password.
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger mb-4">{errorMessage}</div>
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

            <form onSubmit={handleLogin}>
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
                  required
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
                    type={showPassword ? "text" : "password"} // ✅ Dynamic input type
                    className="form-control"
                    id="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text bg-white"
                    style={{ cursor: "pointer" }} // ✅ Add pointer cursor
                    onClick={togglePasswordVisibility} // ✅ Add click handler
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye" : "bi-eye-slash"
                      }`}
                    ></i>
                    {/* ✅ Dynamic icon based on showPassword state */}
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

              <button
                type="submit"
                className={`btn text-white w-100 ${styles.loginBtn}`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Modal */}
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
                <div className="mb-4">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={80}
                    height={55}
                  />
                </div>
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
                  {"You don't need to worry, we will send a reset instruction."}
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
                        />
                        Sending...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>

                <Link href="/admin">
                  <button
                    type="button"
                    className="btn btn-link text-danger text-decoration-none p-0 mt-2"
                    onClick={() => setShowForgotModal(false)}
                    style={{ fontSize: "14px" }}
                  >
                    <i className="bi bi-arrow-left me-1 "></i>
                    Back to login page
                  </button>
                </Link>
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
                  {" Didn't get a mail?"}
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

// ✅ Wrap content with Suspense
export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <Suspense fallback={<div>Loading login...</div>}>
        <LoginPageContent />
      </Suspense>
    </>
  );
}
