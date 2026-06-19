"use client";

import { useEffect, useState } from "react";

const capitalizeWords = (text) => {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function EditCoordinatorModal({
  show,
  school,
  onClose,
  onUpdated,
}) {
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  // ✅ AUTH TOKEN
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ekereAuthToken");
    }
    return null;
  };

  useEffect(() => {
    if (show && school?.school_id) {
      fetchReps();
    }
  }, [show, school]);

  // ✅ FETCH REPS (WITH AUTH)
  const fetchReps = async () => {
    try {
      setLoading(true);
      setError(null);
      setEditingId(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("Missing auth token. Please log in again.");
      }

      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/school/reps/${school.school_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(
          data?.result?.message ||
            "Failed to load coordinators for this school",
        );
      }

      setReps(data?.result?.schoolReps || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setReps([]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (rep) => {
    setEditingId(rep.id);
    setEditName(rep.rep_name || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // ✅ SAVE EDIT (WITH AUTH)
  const saveEdit = async (repId) => {
    try {
      setSaving(true);
      setError(null);

      const token = getAuthToken();

      if (!token) {
        throw new Error("Missing auth token. Please log in again.");
      }

      const response = await fetch(
        "https://api.ekeremgbaakpauche.com/api/admin/school-representative/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            school_id: school.school_id,
            representative_id: repId,
            representative_name: editName.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(
          data?.result?.message || "Failed to update coordinator",
        );
      }

      // ✅ update UI instantly
      setReps((prev) =>
        prev.map((rep) =>
          rep.id === repId ? { ...rep, rep_name: editName } : rep,
        ),
      );

      setEditingId(null);
      setEditName("");

      onUpdated?.();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (!show || !school) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Edit Coordinators — {school.name}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}

            {loading ? (
              <div className="d-flex justify-content-center py-4">
                <div className="spinner-border text-primary" />
              </div>
            ) : reps.length === 0 ? (
              <p className="text-muted">
                No coordinators found for this school.
              </p>
            ) : (
              <ul className="list-group">
                {reps.map((rep) => {
                  const isEditing = editingId === rep.id;

                  return (
                    <li
                      key={rep.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {isEditing ? (
                        <input
                          className="form-control me-3"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span>{capitalizeWords(rep.rep_name)}</span>
                      )}

                      <div className="d-flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              className="btn btn-sm btn-danger"
                              disabled={saving || !editName.trim()}
                              onClick={() => saveEdit(rep.id)}
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>

                            <button
                              className="btn btn-sm btn-light"
                              disabled={saving}
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => startEdit(rep)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-light" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
