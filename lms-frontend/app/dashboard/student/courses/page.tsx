"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

type Course = {
  id: number;
  title: string;
  imageUrl?: string;
  thumbnail?: string;
  lecturerName?: string;
  lecturer?:
    | string
    | {
        id?: number;
        name?: string;
        fullName?: string;
        email?: string;
      };
  lecturer_name?: string;
};

export default function StudentCourses() {
  const router = useRouter();
  const token = getTokenClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  // const [selectedSemester, setSelectedSemester] = useState("ganjil"); // dihapus
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiFetch<Course[]>("/api/courses", {}, token);
        if (mounted) setCourses(data || []);

        const enrollData = await apiFetch<any[]>(
          "/api/enrollments/me",
          {},
          token,
        );
        if (mounted) setEnrollments(enrollData || []);
      } catch (err: any) {
        if (mounted) setError(err?.message || "Gagal memuat courses");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  async function enroll(courseId: number) {
    try {
      await apiFetch(
        "/api/enrollments",
        {
          method: "POST",
          body: JSON.stringify({ courseId: String(courseId) }),
        },
        token,
      );
      // Refresh enrollments before navigating
      const enrollData = await apiFetch<any[]>(
        "/api/enrollments/me",
        {},
        token,
      );
      setEnrollments(enrollData || []);
      router.push("/dashboard/student/activity");
    } catch (err: any) {
      alert(err?.message || "Enroll gagal");
    }
  }

  function openEnrollModal(course: Course) {
    setSelectedCourse(course);
    // setSelectedSemester("ganjil"); // dihapus
    setShowEnrollModal(true);
  }

  async function handleConfirmEnroll() {
    if (!selectedCourse) return;

    // Check if course is already enrolled in the same semester
    const alreadyEnrolled = enrollments.some(
      (e) => e.course?.id === selectedCourse.id,
    );
    if (alreadyEnrolled) {
      alert(`Course "${selectedCourse.title}" sudah terdaftar.`);
      return;
    }

    try {
      await apiFetch(
        "/api/enrollments",
        {
          method: "POST",
          body: JSON.stringify({
            courseId: String(selectedCourse.id),
          }),
        },
        token,
      );
      // Refresh enrollments before navigating
      const enrollData = await apiFetch<any[]>(
        "/api/enrollments/me",
        {},
        token,
      );
      setEnrollments(enrollData || []);
      setShowEnrollModal(false);
      router.push("/dashboard/student/activity");
    } catch (err: any) {
      alert(err?.message || "Enroll gagal");
    }
  }

  function resolveLecturer(course: Course) {
    const candidate =
      course.lecturerName || course.lecturer || course.lecturer_name;
    if (typeof candidate === "string") return candidate;
    if (candidate && typeof candidate === "object") {
      return (
        candidate.name ||
        candidate.fullName ||
        candidate.email ||
        "Belum ditetapkan"
      );
    }
    return "Belum ditetapkan";
  }

  return (
    <AppShell>
      <div className="course-info-head">
        <div>
          <h1>Course Info</h1>
          <div className="course-search">
            <input
              className="course-search-input"
              placeholder="Search course by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <div className="course-error">{error}</div>}

      {loading ? (
        <div className="course-empty">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="course-empty">Belum ada course tersedia.</div>
      ) : (
        (() => {
          const filtered = courses.filter((course) => {
            const title = course.title || "";
            return title.toLowerCase().includes(search.toLowerCase());
          });

          if (filtered.length === 0) {
            return <div className="course-empty">Course tidak ditemukan.</div>;
          }

          return (
            <div className="course-grid">
              {filtered.map((course) => {
                const image = course.imageUrl || course.thumbnail;
                const lecturer = resolveLecturer(course);
                return (
                  <div className="course-card" key={course.id}>
                    <div
                      className="course-cover"
                      style={
                        image
                          ? { backgroundImage: `url(${image})` }
                          : {
                              background:
                                "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                            }
                      }
                    >
                      {!image && (
                        <div className="course-cover-initial">
                          {(course.title || "C").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="course-card-body">
                      <div className="course-name">{course.title}</div>
                      <div className="course-lecturer">
                        Lecturer: {lecturer || "Belum ditetapkan"}
                      </div>
                      {course.description && (
                        <div
                          className="course-desc"
                          style={{
                            color: "#666",
                            fontSize: 14,
                            margin: "8px 0 10px 0",
                          }}
                        >
                          {course.description}
                        </div>
                      )}
                      <button
                        className="course-enroll-btn"
                        onClick={() => openEnrollModal(course)}
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()
      )}

      {/* Enroll Modal */}
      {showEnrollModal && selectedCourse && (
        <div
          className="modal-overlay"
          onClick={() => setShowEnrollModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Enroll Course</h2>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Course Name
              </label>
              <div
                style={{ padding: 10, background: "#f3f4f6", borderRadius: 8 }}
              >
                {selectedCourse.title}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Course ID
              </label>
              <div
                style={{ padding: 10, background: "#f3f4f6", borderRadius: 8 }}
              >
                {selectedCourse.id}
              </div>
            </div>
            {/* Semester select di modal enroll dihapus */}
            <div
              style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
            >
              <button
                className="btn-secondary"
                onClick={() => setShowEnrollModal(false)}
              >
                Cancel
              </button>
              <button className="btn" onClick={handleConfirmEnroll}>
                Enroll
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
