"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function LecturerDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const token = getTokenClient();

  useEffect(() => {
    apiFetch<any[]>("/api/courses/my-courses", {}, token)
      .then(setCourses)
      .catch(() => {});
    apiFetch<any[]>("/api/assignments", {}, token)
      .then(setAssignments)
      .catch(() => {});
  }, [token]);

  return (
    <AppShell>
      <div className="grid">
        <section className="card">
          <div className="h1">Beranda</div>
          <div className="muted">Ringkasan courses & tugas dosen</div>

          <div style={{ height: 14 }} />

          <div className="h2">Courses yang dipegang</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {courses.map((c) => (
              <li key={c.id}>{c.title}</li>
            ))}
          </ul>
        </section>

        <aside className="card">
          <div className="h2">Info Tugas</div>
          <div className="muted" style={{ marginBottom: 10 }}>
            Tugas yang dibuat
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {assignments.slice(0, 5).map((a) => (
              <li key={a.id}>{a.title}</li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
