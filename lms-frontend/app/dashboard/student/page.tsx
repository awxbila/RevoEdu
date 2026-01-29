"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";

import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const token = getTokenClient();

  // Fetch enrollments once
  useEffect(() => {
    if (!token) return;
    apiFetch<any[]>("/api/enrollments/me", {}, token)
      .then((data) => setEnrollments(Array.isArray(data) ? data : []))
      .catch(() => setEnrollments([]));
  }, [token]);

  // Fetch assignments after enrollments didapat
  useEffect(() => {
    if (!token) return;
    if (!enrollments || enrollments.length === 0) {
      setAssignments([]);
      return;
    }
    const enrolledCourseIds = enrollments.map((e) => e.courseId);
    apiFetch<any[]>("/api/assignments", {}, token)
      .then((data) => {
        if (Array.isArray(data)) {
          setAssignments(
            data.filter((a) => enrolledCourseIds.includes(a.course?.id)),
          );
        } else {
          setAssignments([]);
        }
      })
      .catch(() => setAssignments([]));
  }, [token, enrollments]);

  // Fetch quizzes (tidak tergantung enrollments)
  useEffect(() => {
    if (!token) return;
    apiFetch<any[]>("/api/quizzes/student", {}, token)
      .then((data) => setQuizzes(Array.isArray(data) ? data : []))
      .catch(() => setQuizzes([]));
  }, [token]);

  return (
    <AppShell>
      <div className="grid" style={{ gap: 32, alignItems: "flex-start" }}>
        <section className="card" style={{ minWidth: 320, flex: 2 }}>
          <div className="h1">Beranda</div>
          <div className="muted">Ringkasan courses & tugas kamu</div>
          <div style={{ height: 14 }} />
          <div
            className="h2"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            Courses yang diambil
            <span style={{ color: "#0369a1", fontWeight: 600, fontSize: 16 }}>
              ({enrollments.length})
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 0 }}>
            {enrollments.map((e) => (
              <li key={e.id} style={{ marginBottom: 4 }}>
                {e.course?.title}
              </li>
            ))}
          </ul>
        </section>

        <aside
          className="card"
          style={{
            minWidth: 320,
            flex: 1,
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 2px 12px #00000008",
            padding: 24,
          }}
        >
          <div className="h2" style={{ marginBottom: 10 }}>
            Info Tugas
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {assignments.slice(0, 5).map((a) => (
              <div
                key={a.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 2,
                  boxShadow: "0 1px 4px #0001",
                }}
              >
                <div style={{ fontWeight: 600 }}>{a.title}</div>
                {a.dueDate && (
                  <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
                    Deadline: {new Date(a.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
            {assignments.length === 0 && (
              <div style={{ color: "#aaa", fontSize: 14 }}>
                Belum ada tugas.
              </div>
            )}
          </div>

          <div className="h2" style={{ marginTop: 28, marginBottom: 10 }}>
            Info Quiz
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {quizzes.slice(0, 5).map((q: any) => (
              <div
                key={q.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 2,
                  boxShadow: "0 1px 4px #0001",
                }}
              >
                <div style={{ fontWeight: 600 }}>{q.title}</div>
                {q.deadline && (
                  <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
                    Deadline: {new Date(q.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
            {quizzes.length === 0 && (
              <div style={{ color: "#aaa", fontSize: 14 }}>Belum ada quiz.</div>
            )}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
