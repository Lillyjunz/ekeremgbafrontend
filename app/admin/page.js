import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./admin.module.css";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>

      <div
        className={`d-flex flex-column justify-content-center align-items-center vh-100 ${styles.bgLight}`}
      >
        {/* Logo outside the form */}
        <div className="mb-3">
          <Image src="/images/logo.png" alt="Logo" width={120} height={80} />
        </div>

        {/* Login Form */}
        <div
          className={`shadow p-5 rounded-4 bg-white border ${styles.formContainer}`}
        >
          <h2 className="text-center fw-bold mb-2" style={{ color: "#606060" }}>
            Welcome Admin!
          </h2>
          <p className="text-center text-muted mb-4">
            Kindly fill in your details to login to your acccount
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
              <a href="#" className="text-danger text-decoration-none">
                Forgot password?
              </a>
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
    </>
  );
}
