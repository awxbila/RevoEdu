"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

type Enrollment = {
  id: number;
  // semester: string; // dihapus, tidak dipakai lagi
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
  // const [selectedSemester, setSelectedSemester] = useState("ganjil"); // dihapus
  const token = getTokenClient();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        // Fetch enrollments
        const enrollData = await apiFetch<any[]>(
          "/api/enrollments/me",
          {},
          token,
        );
        if (mounted) setEnrollments(enrollData || []);

        // Fetch all available courses
        const courseData = await apiFetch<any[]>("/api/courses", {}, token);
        if (mounted) setAllCourses(courseData || []);
      } catch (err) {
        if (mounted) {
          setEnrollments([]);
          setAllCourses([]);
        }
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
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
        token,
      );
      // Refresh enrollments
      const updated = await apiFetch<any[]>("/api/enrollments/me", {}, token);
      setEnrollments(updated || []);
      setShowAddModal(false);
      setSelectedCourse("");
      // setSelectedSemester("ganjil"); // dihapus
    } catch (err: any) {
      alert(err?.message || "Gagal menambahkan course");
    }
  };

  // const handleSemesterChange = ... // dihapus, tidak dipakai lagi

  // Helper to fetch lecturer detail if only id is present
  async function handleLecturerClick(lecturer: any) {
    if (lecturer && lecturer.id && (!lecturer.email || !lecturer.phone)) {
      try {
        // Update endpoint here to match backend
        const detail = await apiFetch(
          `/api/users/lecturer/${lecturer.id}`,
          {},
          token,
        );
        setSelectedLecturer(detail);
      } catch {
        setSelectedLecturer(lecturer); // fallback
      }
    } else {
      setSelectedLecturer(lecturer);
    }
    setShowLecturerModal(true);
  }

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
              <th>ID Course</th>
              <th>Name Course</th>
              <th>Lecturer</th>
              <th>Status</th>
              <th>Module</th>
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
                  <td>{e.course.id}</td>
                  <td>{e.course.title}</td>
                  <td>
                    {e.course.lecturer ? (
                      <button
                        className="lecturer-link"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2563eb",
                          textDecoration: "underline",
                          cursor: "pointer",
                          padding: 0,
                          font: "inherit",
                        }}
                        onClick={() => handleLecturerClick(e.course.lecturer)}
                      >
                        {e.course.lecturer.name}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor:
                          !e.status ||
                          e.status.toLowerCase() === "aktif" ||
                          e.status.toLowerCase() === "active"
                            ? "#10b981"
                            : "#999",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-block",
                        fontSize: "12px",
                      }}
                    >
                      {e.status || "Aktif"}
                    </span>
                  </td>
                  <td>
                    <button
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 16px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #2563eb22",
                        transition: "background 0.2s",
                      }}
                      onClick={() => {
                        const courseId = e.course?.id;
                        if (courseId)
                          router.push(
                            `/dashboard/student/activity/${courseId}`,
                          );
                      }}
                    >
                      Module
                    </button>
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
            {/* Semester select di modal add course dihapus */}
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
              <p>
                <strong>Phone:</strong>{" "}
                {selectedLecturer.phone || (
                  <span style={{ color: "#aaa" }}>Belum diisi</span>
                )}
              </p>
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
