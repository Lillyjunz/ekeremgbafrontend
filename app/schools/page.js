"use client";

import { useEffect, useState } from "react";
import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import styles from "./schools.module.css";

export default function RankingTable() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(
          "https://api.ekeremgbaakpauche.com/api/school/get-schools"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data?.schools?.allSchools) {
          setSchools(data.schools.allSchools);
        } else {
          setError("No schools found");
        }
      } catch (err) {
        console.error("Error fetching schools:", err);
        setError("Failed to fetch schools");
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#fafafa" }}>
        <div className="container py-5">
          <div className={styles.rankingWrapper}>
            <h3 className="mb-4 fw-bold">School Rankings</h3>

            {loading ? (
              <p>Loading schools...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <table className="table mb-0">
                <thead>
                  <tr className="text-muted">
                    <th>Ranking</th>
                    <th>School Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>No. of Students</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school, index) => (
                    <tr key={school.school_id}>
                      <td>{index + 1}</td>
                      <td>{school.name}</td>
                      <td>{school.phone}</td>
                      <td>{school.email}</td>
                      <td>{school.students?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
