// components/CallToAction.js
"use client";

import Link from "next/link";

export default function CallToAction() {
  return (
    <div className="py-5" style={{ backgroundColor: "#fafafa" }}>
      <div className="bannerContainer d-flex flex-column justify-content-center align-items-center text-white text-center">
        <h2 className="fw-bold mb-3">Ready to Join the Game?</h2>
        <Link href="/register" className="btn registerBtn">
          Register your School
        </Link>
      </div>
    </div>
  );
}
