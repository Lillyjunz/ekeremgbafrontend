"use client";

// Layout.js (your main layout component)
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname.includes("/tournament")) return "Tournament";
    if (pathname.includes("/schools")) return "Schools";
    if (pathname.includes("/report")) return "Report";
    return "Tournament"; // default
  };

  const activeTab = getActiveTab();

  return (
    <div className={`${styles.dashboard} min-vh-100`}>
      {/* Header */}
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container-fluid px-4">
          {/* Logo */}
          <div className={`navbar-brand ${styles.brand}`}>
            <div>
              <Image
                src="/images/logo.png"
                width={120}
                height={60}
                alt="logo"
              ></Image>
            </div>
          </div>

          {/* Navigation Links */}
          <div className={`navbar-nav mx-auto ${styles.navLinks}`}>
            <div className="naco">
              <button
                className={`nav-link btn btn-link ${styles.navLink} ${
                  activeTab === "Tournament" ? styles.active : ""
                }`}
                onClick={() => router.push("/admin/dashboard")}
              >
                Tournament
              </button>
            </div>
            <button
              className={`nav-link btn btn-link ${styles.navLink} ${
                activeTab === "Schools" ? styles.active : ""
              }`}
              onClick={() => router.push("/admin/dashboard/schools")}
            >
              Schools
            </button>
            <button
              className={`nav-link btn btn-link ${styles.navLink} ${
                activeTab === "Report" ? styles.active : ""
              }`}
              onClick={() => router.push("/admin/dashboard/report")}
            >
              Report
            </button>
          </div>

          {/* Admin Profile */}
          <div className={`dropdown ${styles.adminDropdown}`}>
            <button
              className={`btn ${styles.adminBtn}`}
              type="button"
              data-bs-toggle="dropdown"
            >
              <div className="user">
                <Image
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                  src="/images/day2.jpg"
                  height={25}
                  width={25}
                  alt="admin"
                ></Image>
              </div>

              <span className={styles.adminText}>
                Admin <i className="bi bi-chevron-down ms-1 me-2"></i>
              </span>
            </button>
            <ul className="dropdown-menu mt-2">
              <li>
                <a className="dropdown-item" href="#">
                  Change Password
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{ color: "rgba(255, 0, 0, 1)" }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`container-fluid ${styles.mainContent}`}>
        {children}
      </main>
    </div>
  );
}
