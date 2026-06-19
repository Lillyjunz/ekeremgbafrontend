"use client";

import { useEffect, useState } from "react";

const capitalizeWords = (text) => {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function EditStudentModal({ show, school, onClose, onUpdated }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  // ✅ AUTH TOKEN (same style as your dashboard)
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ekereAuthToken");
    }
    return null;
  };

  useEffect(() => {
    if (show && school) {
      fetchStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, school]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      setEditingId(null);

      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token. Please login again.");

      const schoolId = school?.school_id || school?.id;

      const response = await fetch(
        `https://api.ekeremgbaakpauche.com/api/admin/school/${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.status) {
        throw new Error(
          data?.result?.message || "Failed to load students for this school",
        );
      }

      setStudents(data?.result?.students || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditName(student.fullname || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (studentId) => {
    try {
      setSaving(true);
      setError(null);

      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token. Please login again.");

      const schoolId = school?.school_id || school?.id;

      const response = await fetch(
        "https://api.ekeremgbaakpauche.com/api/admin/student/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            school_id: schoolId,
            student_id: studentId,
            fullname: editName,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.status) {
        throw new Error(data?.result?.message || "Failed to update student");
      }

      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? { ...student, fullname: editName }
            : student,
        ),
      );

      setEditingId(null);
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
          <div className="modal-header">
            <h5 className="modal-title">Edit Students — {school.name}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger py-2">{error}</div>}

            {loading ? (
              <div className="d-flex justify-content-center py-4">
                <div className="spinner-border text-primary" />
              </div>
            ) : students.length === 0 ? (
              <p className="text-muted">No students found.</p>
            ) : (
              <ul className="list-group">
                {students.map((student) => {
                  const isEditing = editingId === student.id;

                  return (
                    <li
                      key={student.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {isEditing ? (
                        <input
                          className="form-control me-2"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        <span>{capitalizeWords(student.fullname)}</span>
                      )}

                      <div className="d-flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              className="btn btn-sm btn-danger"
                              disabled={saving}
                              onClick={() => saveEdit(student.id)}
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>

                            <button
                              className="btn btn-sm btn-light"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => startEdit(student)}
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
