// Layout.js
"use client";

import ChangePasswordModal from "@/app/Components/changepassword";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./dashboard.module.css";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const getActiveTab = () => {
    if (pathname.includes("/tournament")) return "Tournament";
    if (pathname.includes("/schools")) return "Schools";
    if (pathname.includes("/report")) return "Report";
    return "Tournament";
  };

  const activeTab = getActiveTab();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const hideNavbar = pathname.includes("/admin/dashboard/scoreboard");

  return (
    <div className={`${styles.dashboard} min-vh-100`}>
      {!hideNavbar && (
        <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
          <div className="container-fluid px-4">
            <div className={`navbar-brand ${styles.brand}`}>
              <Link href="/admin/dashboard">
                <Image
                  src="/images/logo.png"
                  width={120}
                  height={60}
                  alt="logo"
                />
              </Link>
            </div>

            <button
              className={`${styles.toggleBtn} d-lg-none`}
              type="button"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className={styles.toggleIcon}></span>
              <span className={styles.toggleIcon}></span>
              <span className={styles.toggleIcon}></span>
            </button>

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
                  />
                </div>
                <span className={`${styles.adminText} d-none d-sm-inline`}>
                  Admin <i className="bi bi-chevron-down ms-1 me-2"></i>
                </span>
              </button>
              <ul className="dropdown-menu mt-2">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="dropdown-item"
                    style={{ color: "rgba(255, 0, 0, 1)" }}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>

            <div
              className={`${styles.navLinksContainer} ${
                isMenuOpen ? styles.navLinksOpen : ""
              }`}
            >
              <div className={`navbar-nav ${styles.navLinks}`}>
                <button
                  className={`nav-link btn btn-link ${styles.navLink} ${
                    activeTab === "Tournament" ? styles.active : ""
                  }`}
                  onClick={() => handleNavClick("/admin/dashboard")}
                >
                  Tournament
                </button>
                <button
                  className={`nav-link btn btn-link ${styles.navLink} ${
                    activeTab === "Schools" ? styles.active : ""
                  }`}
                  onClick={() => handleNavClick("/admin/dashboard/schools")}
                >
                  Schools
                </button>
                <button
                  className={`nav-link btn btn-link ${styles.navLink} ${
                    activeTab === "Report" ? styles.active : ""
                  }`}
                  onClick={() => handleNavClick("/admin/dashboard/report")}
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={`container-fluid ${styles.mainContent}`}>
        {children}
      </main>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
