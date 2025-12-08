"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Load Bootstrap JS
    import("bootstrap/dist/js/bootstrap.bundle.min.js");

    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return null;
}
