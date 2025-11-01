"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function LeaderboardPage() {
  const { id } = useParams();
  const router = useRouter();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ekereAuthToken");
    }
    return null;
  };

  // ✅ useCallback to memoize the fetch function
  const fetchLeaderboard = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Missing authentication token");

      const res = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/leaderboard?tournamentId=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load leaderboard");

      setLeaderboard(data.leaderboard || []);
      setError("");
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]); // ✅ dependency: id

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchLeaderboard();

    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [id, fetchLeaderboard]); // ✅ now dependencies are complete

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Tournament Leaderboard</h4>
        <button
          className="btn btn-outline-danger rounded-pill"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">Loading leaderboard...</p>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && leaderboard.length > 0 && (
        <div className="card shadow-sm border-0 p-4">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>School</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.school}</td>
                  <td>{item.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted small text-end mb-0 mt-2">
            Auto-refreshing every 10 seconds 🔄
          </p>
        </div>
      )}

      {!loading && leaderboard.length === 0 && !error && (
        <p className="text-muted mt-3">No leaderboard data found.</p>
      )}
    </div>
  );
}
