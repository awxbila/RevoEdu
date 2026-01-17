"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

type Enrollment = {
  id: number;
  semester: string;
  course: {
    id: number;
    title: string;
    lecturer?: {
      id: number;
      name: string;
      email: string;
      phone?: string;
    };
  };
  status: string;
};

export default function StudentActivity() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("ganjil");
  const token = getTokenClient();

  useEffect(() => {
    // Fetch enrollments
    apiFetch<any[]>("/api/enrollments/me", {}, token)
      .then((data) => setEnrollments(data || []))
      .catch(() => setEnrollments([]));

    // Fetch all available courses
    apiFetch<any[]>("/api/courses", {}, token)
      .then((data) => setAllCourses(data || []))
      .catch(() => setAllCourses([]));
  }, [token]);

  const handleAddCourse = async () => {
    if (!selectedCourse) return;
    try {
      await apiFetch(
        "/api/enrollments",
        {
          method: "POST",
          body: JSON.stringify({
            courseId: selectedCourse,
          }),
        },
        token
      );
      // Refresh enrollments
      const updated = await apiFetch<any[]>("/api/enrollments/me", {}, token);
      setEnrollments(updated || []);
      setShowAddModal(false);
      setSelectedCourse("");
      setSelectedSemester("ganjil");
    } catch (err: any) {
      alert(err?.message || "Gagal menambahkan course");
    }
  };

  const handleSemesterChange = async (
    enrollmentId: number,
    newSemester: string
  ) => {
    try {
      await apiFetch(
        `/api/enrollments/${enrollmentId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ semester: newSemester }),
        },
        token
      );
      // Update local state
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollmentId ? { ...e, semester: newSemester } : e
        )
      );
    } catch (err: any) {
      alert(err?.message || "Gagal update semester");
    }
  };

  return (
    <AppShell>
      <div className="study-activity-header">
        <h1 className="study-activity-title">Study Activity</h1>
        <button
          className="add-course-btn"
          onClick={() => setShowAddModal(true)}
          title="Add Course"
        >
          +
        </button>
      </div>

      <div className="study-activity-card">
        <table className="study-activity-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Semester</th>
              <th>ID Course</th>
              <th>Name Course</th>
              <th>Lecturer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                  Belum ada course yang diambil
                </td>
              </tr>
            ) : (
              enrollments.map((e, idx) => (
                <tr key={e.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <select
                      value={e.semester || "ganjil"}
                      onChange={(ev) =>
                        handleSemesterChange(e.id, ev.target.value)
                      }
                      className="semester-select"
                    >
                      <option value="ganjil">Ganjil</option>
                      <option value="genap">Genap</option>
                    </select>
                  </td>
                  <td>{e.course?.id || "-"}</td>
                  <td>{e.course?.title || "-"}</td>
                  <td>
                    {e.course?.lecturer ? (
                      <button
                        className="lecturer-link"
                        onClick={() => {
                          setSelectedLecturer(e.course.lecturer);
                          setShowLecturerModal(true);
                        }}
                      >
                        {e.course.lecturer.name}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <span className="status-badge">{e.status || "Aktif"}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Course</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 6 }}>
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="input"
              >
                <option value="">-- Select Course --</option>
                {allCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 6 }}>
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="input"
              >
                <option value="ganjil">Ganjil</option>
                <option value="genap">Genap</option>
              </select>
            </div>
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="btn" onClick={handleAddCourse}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lecturer Modal */}
      {showLecturerModal && selectedLecturer && (
        <div
          className="modal-overlay"
          onClick={() => setShowLecturerModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Lecturer Profile</h2>
            <div className="lecturer-profile">
              <p>
                <strong>Name:</strong> {selectedLecturer.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedLecturer.email}
              </p>
              {selectedLecturer.phone && (
                <p>
                  <strong>Phone:</strong> {selectedLecturer.phone}
                </p>
              )}
            </div>
            <div style={{ textAlign: "right", marginTop: 20 }}>
              <button
                className="btn"
                onClick={() => setShowLecturerModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
