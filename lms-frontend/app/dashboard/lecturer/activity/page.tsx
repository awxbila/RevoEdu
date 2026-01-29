"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

interface Course {
  id: number;
  title: string;
  description?: string;
  code?: string;
  imageUrl?: string;
  thumbnail?: string;
  lecturer?: { id?: number; name?: string };
  lecturer_name?: string;
}

interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  semester: string;
  status: string;
  enrolledAt: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface Module {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  type: "pdf" | "ppt" | "video";
  fileUrl: string;
}

type NewModuleState = {
  title: string;
  description: string;
  file: File | null;
};

export default function LecturerActivity() {
  const token = getTokenClient();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  const [loading, setLoading] = useState(false);

  const [addingModule, setAddingModule] = useState(false);
  const [isPushingModule, setIsPushingModule] = useState(false);
  const [pushError, setPushError] = useState("");

  const [newModule, setNewModule] = useState<NewModuleState>({
    title: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiFetch<Course[]>("/api/courses/my-courses", {}, token)
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!selectedCourse || !token) return;
    setLoading(true);
    Promise.all([
      apiFetch<Enrollment[]>(
        `/api/enrollments/course/${selectedCourse.id}`,
        {},
        token,
      ),
      apiFetch<Module[]>(
        `/api/courses/${selectedCourse.id}/modules`,
        {},
        token,
      ),
    ])
      .then(([enrollmentsData, modulesData]) => {
        setEnrollments(enrollmentsData);
        setModules(modulesData);
        // Fetch students for enrollments
        if (enrollmentsData.length > 0) {
          Promise.all(
            enrollmentsData.map((enr) =>
              apiFetch<Student>(
                `/api/enrollments/${enr.id}/student`,
                {},
                token,
              ),
            ),
          ).then((studentsArr) => setStudents(studentsArr));
        } else {
          setStudents([]);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedCourse, token]);
  return (
    <AppShell>
      {!selectedCourse ? (
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Course list */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            {courses.map((course) => {
              const image =
                course.thumbnail || course.imageUrl
                  ? ((course.thumbnail || course.imageUrl) as string)
                  : "";

              const resolvedImage =
                image && image.startsWith("http")
                  ? image
                  : image
                    ? `${process.env.NEXT_PUBLIC_API_URL}${image}`
                    : "";

              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 12,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "#fff",
                    boxShadow: "0 2px 12px #00000010",
                  }}
                >
                  <div
                    style={
                      resolvedImage
                        ? {
                            backgroundImage: `url(${resolvedImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: 120,
                          }
                        : {
                            background:
                              "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                            height: 120,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }
                    }
                  >
                    {!resolvedImage && (
                      <div
                        style={{ color: "#fff", fontSize: 48, fontWeight: 700 }}
                      >
                        {(course.title || "C").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 18 }}>
                    <div
                      style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}
                    >
                      {course.title}
                    </div>
                    <div style={{ color: "#888", fontSize: 14 }}>
                      {course.code}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button
            onClick={() => setSelectedCourse(null)}
            style={{ marginBottom: 16 }}
          >
            ← Back to Courses
          </button>

          {/* Kiri: Gambar dan Kanan: Detail */}
          <div
            style={{
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
              marginBottom: 32,
            }}
          >
            <div style={{ flex: 1, minWidth: 220 }}>
              {selectedCourse.imageUrl ? (
                <img
                  src={
                    selectedCourse.imageUrl.startsWith("http")
                      ? selectedCourse.imageUrl
                      : `${process.env.NEXT_PUBLIC_API_URL}${selectedCourse.imageUrl}`
                  }
                  alt="Course"
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    objectFit: "cover",
                    maxHeight: 180,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    background: "#eee",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  No Image
                </div>
              )}
            </div>

            <div style={{ flex: 2 }}>
              <h2 style={{ marginTop: 0 }}>{selectedCourse.title}</h2>
              <div style={{ color: "#888", marginBottom: 8 }}>
                {selectedCourse.code}
              </div>
              <div style={{ marginBottom: 16 }}>
                {selectedCourse.description}
              </div>
              <div style={{ marginBottom: 8 }}>
                <b>Total Students Enrolled:</b> {enrollments.length}
              </div>
            </div>
          </div>

          {/* Enrolled Students */}
          <h3>Enrolled Students</h3>
          <div style={{ marginBottom: 32 }}>
            {students.length === 0 ? (
              <div style={{ color: "#888" }}>
                Belum ada mahasiswa yang enroll.
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {students.map((student) => (
                  <div
                    key={student.id}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 8,
                      padding: 12,
                      background: "#f8fafc",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{student.name}</div>
                    <div style={{ color: "#666", fontSize: 14 }}>
                      {student.email}
                    </div>
                    <div style={{ color: "#666", fontSize: 14 }}>
                      <b>Phone:</b>{" "}
                      {student.phone || (
                        <span style={{ color: "#aaa" }}>Belum diisi</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modules */}
          <h3>Modules</h3>
          <div style={{ marginBottom: 24 }}>
            {modules.length === 0 ? (
              <div style={{ color: "#888" }}>Belum ada module.</div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {modules.map((mod) => (
                  <div
                    key={mod.id}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 8,
                      padding: 16,
                      background: "#fafbfc",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}
                    >
                      {mod.title}
                    </div>

                    {mod.description && (
                      <div
                        style={{ color: "#666", fontSize: 15, marginBottom: 4 }}
                      >
                        {mod.description}
                      </div>
                    )}

                    {/* Materi preview langsung di card */}
                    {(() => {
                      // Only use mod.type (original logic)
                      const type = (mod.type || "").toLowerCase();
                      let fileUrl = mod.fileUrl;
                      if (fileUrl && !fileUrl.startsWith("http")) {
                        fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${fileUrl}`;
                      }
                      if (type === "pdf") {
                        return (
                          <iframe
                            src={fileUrl}
                            style={{
                              width: "100%",
                              minHeight: 320,
                              border: "1px solid #ccc",
                              borderRadius: 6,
                            }}
                            title={mod.title}
                            allow="autoplay"
                          />
                        );
                      } else if (type === "video") {
                        return (
                          <video
                            src={fileUrl}
                            controls
                            style={{
                              width: "100%",
                              maxWidth: 480,
                              borderRadius: 6,
                              background: "#000",
                            }}
                          />
                        );
                      } else if (type === "ppt") {
                        return (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#0369a1",
                              textDecoration: "underline",
                              fontWeight: 500,
                            }}
                          >
                            PPT Materi
                          </a>
                        );
                      }
                      return null;
                    })()}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setAddingModule(true)}
            style={{
              background: "#e0f2fe",
              color: "#0369a1",
              border: 0,
              borderRadius: 6,
              padding: "8px 24px",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            + Add Module
          </button>

          {/* Modal Add Module */}
          {addingModule && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "#0008",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 32,
                  minWidth: 340,
                  maxWidth: 400,
                  boxShadow: "0 4px 24px #0002",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => {
                    setAddingModule(false);
                    setNewModule({ title: "", description: "", file: null });
                    setPushError("");
                  }}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 16,
                    background: "none",
                    border: 0,
                    fontSize: 22,
                    cursor: "pointer",
                    color: "#888",
                  }}
                >
                  ×
                </button>

                <h2 style={{ marginTop: 0, marginBottom: 18 }}>Add Module</h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!selectedCourse) return;

                    setIsPushingModule(true);
                    setPushError("");

                    try {
                      if (!newModule.title || !newModule.file) {
                        setPushError("Judul dan file wajib diisi.");
                        return;
                      }

                      const form = new FormData();
                      form.append("title", newModule.title);

                      if (newModule.description) {
                        form.append("description", newModule.description);
                      }

                      form.append("file", newModule.file);

                      await apiFetch(
                        `/api/courses/${selectedCourse.id}/modules`,
                        { method: "POST", body: form },
                        token,
                      );

                      // Refresh modules
                      const updated = await apiFetch<Module[]>(
                        `/api/courses/${selectedCourse.id}/modules`,
                        {},
                        token,
                      );

                      setModules(updated);
                      setAddingModule(false);
                      setNewModule({ title: "", description: "", file: null });
                    } catch (err: any) {
                      setPushError(err?.message || "Gagal push module");
                    } finally {
                      setIsPushingModule(false);
                    }
                  }}
                >
                  <label style={{ fontWeight: 600 }}>Module title</label>
                  <input
                    value={newModule.title}
                    onChange={(e) =>
                      setNewModule((m) => ({ ...m, title: e.target.value }))
                    }
                    required
                    style={{
                      width: "100%",
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />

                  <label style={{ fontWeight: 600 }}>Description</label>
                  <textarea
                    value={newModule.description}
                    onChange={(e) =>
                      setNewModule((m) => ({
                        ...m,
                        description: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      marginBottom: 12,
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      minHeight: 48,
                    }}
                  />

                  <label style={{ fontWeight: 600 }}>File (PDF/Video)</label>
                  <input
                    type="file"
                    accept="application/pdf,video/*"
                    onChange={(e) =>
                      setNewModule((m) => ({
                        ...m,
                        file: e.target.files?.[0] || null,
                      }))
                    }
                    required
                    style={{ marginBottom: 12 }}
                  />

                  {pushError && (
                    <div style={{ color: "#dc2626", marginBottom: 8 }}>
                      {pushError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPushingModule}
                    style={{
                      background: isPushingModule ? "#a3a3a3" : "#22c55e",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 16,
                      border: 0,
                      borderRadius: 8,
                      padding: "10px 32px",
                      cursor: isPushingModule ? "not-allowed" : "pointer",
                      opacity: isPushingModule ? 0.7 : 1,
                    }}
                  >
                    {isPushingModule ? "Processing..." : "Push"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
