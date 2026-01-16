"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function LecturerDashboard() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/api/courses", {}, getTokenClient())
      .then(setCourses)
      .catch(() => {});
  }, []);

  return (
    <AppShell>
      <h1>Beranda Lecturer</h1>
      <p>Courses yang dipegang:</p>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </AppShell>
  );
}
