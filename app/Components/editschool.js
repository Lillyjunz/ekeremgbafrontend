"use client";

import { useEffect, useState } from "react";

export default function EditSchoolModal({ show, school, onClose, onUpdated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ekereAuthToken");
    }
    return null;
  };

  useEffect(() => {
    if (school) {
      setName(school.name || "");
      setEmail(school.email || "");
      setPhone(school.phone || "");
      setError(null);
    }
  }, [school, show]);

  if (!show || !school) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Missing auth token. Please log in again.");
      }

      // ✅ FIX APPLIED HERE

      const schoolId = school?.school_id;

      if (!schoolId) {
        throw new Error("Invalid school_id from backend");
      }

      const payload = {
        school_id: school.school_id, // MUST be this exact string
        name: name.trim(),
        email: email.trim().toLowerCase(), // fix email too
        phone: phone.trim(),
      };

      console.log("SENDING PAYLOAD:", payload);

      const response = await fetch(
        "https://api.ekeremgbaakpauche.com/api/admin/schools/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        },
      );

      let data;

      try {
        data = await response.json();
      } catch (err) {
        data = await response.text();
      }

      if (!response.ok) {
        console.log("UPDATE RESPONSE STATUS:", response.status);
        console.log("UPDATE RESPONSE DATA:", data);

        throw new Error(
          typeof data === "string"
            ? data
            : data?.message ||
                data?.result?.message ||
                JSON.stringify(data) ||
                "Update failed",
        );
      }

      onUpdated?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit School</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="mb-3">
                <label className="form-label">School Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-danger"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
