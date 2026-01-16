"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function StudentCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const token = getTokenClient();

  useEffect(() => {
    apiFetch<any[]>("/api/courses", {}, token).then(setCourses);
  }, [token]);

  async function enroll(courseId: number) {
    await apiFetch(
      "/api/enrollments",
      {
        method: "POST",
        body: JSON.stringify({ courseId }),
      },
      token
    );
    alert("Berhasil enroll");
  }

  return (
    <AppShell>
      <h1>Semua Courses</h1>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>
            {c.title} <button onClick={() => enroll(c.id)}>Enroll</button>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
