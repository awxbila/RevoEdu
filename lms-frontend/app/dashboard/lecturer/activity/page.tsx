"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function LecturerActivity() {
  const token = getTokenClient();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/api/courses", {}, token).then(setCourses);
  }, [token]);

  return (
    <AppShell>
      <h1>Aktivitas Lecturer</h1>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </AppShell>
  );
}
