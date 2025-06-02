"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (href) => pathname === href;

  const [showModal, setShowModal] = useState(true);

  return (
    <>
      <nav
        className="navbar navbar-light shadow-sm sticky-top px-3 px-md-5 py-2"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Left: Toggle (small only) + Brand */}
          <div className="d-flex align-items-center">
            {/* Toggle visible only on small screens */}
            <button
              onClick={toggleNavbar}
              className="border-0 bg-transparent p-0 me-2 toggle-btn d-md-none"
              style={{ color: "#680B05" }}
              type="button"
              aria-label="Toggle navigation"
            >
              <span className="fs-4">
                <i className={isOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
              </span>
            </button>

            {/* Brand always visible */}
            <Link href="/" className="navbar-brand fw-bold fs-4 mb-0">
              <Image
                src="/images/logo.png"
                width={130}
                height={60}
                alt="logo"
              ></Image>
            </Link>
          </div>

          {/* Center: Desktop menu */}
          <ul className="navbar-nav mx-auto d-none d-md-flex flex-row align-items-center gap-4 mb-0">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/fixtures"
                className={`nav-link ${isActive("/fixtures") ? "active" : ""}`}
              >
                Fixtures
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/schools"
                className={`nav-link ${isActive("/schools") ? "active" : ""}`}
              >
                Schools
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/about"
                className={`nav-link ${isActive("/about") ? "active" : ""}`}
              >
                About
              </Link>
            </li>
          </ul>

          {/* Right: Desktop login/signup buttons */}
          <div className="d-none d-md-flex gap-2 align-items-center">
            <Link
              href="/login"
              className="btn"
              style={{
                borderRadius: "10px",
                color: "#333333",
                border: "2px solid #f2f2f2",
              }}
            >
              English <i className="fa-solid fa-angle-down"></i>
            </Link>
            <Link
              href="/register"
              className="btn btn-light navaa p-3"
              style={{ borderRadius: "35px" }}
            >
              Register your School
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`mobile-nav bg-white shadow position-fixed top-0 start-0 h-100 p-4 d-flex flex-column ${
          isOpen ? "open" : ""
        }`}
      >
        {/* Brand + Close button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link
            href="/"
            className="navbar-brand fw-bold fs-4 mb-0"
            style={{ color: "#680B05" }}
          >
            Ekeremgba
          </Link>
          <button
            onClick={toggleNavbar}
            className="btn-close"
            aria-label="Close"
          ></button>
        </div>

        <ul className="list-unstyled flex-grow-1">
          <li className="mb-3">
            <Link
              href="/"
              className={`text-decoration-none side-text ${
                isActive("/") ? "active" : ""
              }`}
              onClick={toggleNavbar}
            >
              <i className="fa-solid fa-house me-2"></i>
              Home
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/fixtures"
              className={`text-decoration-none side-text ${
                isActive("/fixtures") ? "active" : ""
              }`}
              onClick={toggleNavbar}
            >
              <i className="fa-solid fa-book-open-reader me-2"></i>
              Fixtures
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/schools"
              className={`text-decoration-none side-text ${
                isActive("/schools") ? "active" : ""
              }`}
              onClick={toggleNavbar}
            >
              <i className="fa-solid fa-circle-info me-2"></i>
              Schools
            </Link>
          </li>
          <li className="mb-3">
            <Link
              href="/contact"
              className={`text-decoration-none side-text ${
                isActive("/contact") ? "active" : ""
              }`}
              onClick={toggleNavbar}
            >
              <i className="fa-solid fa-circle-info me-2"></i>
              About Us
            </Link>
          </li>
        </ul>

        <div className="d-flex gap-2 mt-auto flex-column">
          <div
            className="btn  w-100"
            onClick={toggleNavbar}
            style={{
              borderRadius: "10px",
              color: "#333333",
              border: "2px solid #f2f2f2",
            }}
          >
            English <i className="fa-solid fa-angle-down"></i>
          </div>

          <Link
            href="/register"
            className="btn text-light navaa p-2 side-butt w-100"
            style={{ borderRadius: "35px" }}
          >
            Register your School
          </Link>
        </div>
      </div>
    </>
  );
}
