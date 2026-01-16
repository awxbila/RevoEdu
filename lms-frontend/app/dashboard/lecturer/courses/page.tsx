"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function ManageCourses() {
  const token = getTokenClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  async function load() {
    const data = await apiFetch<any[]>("/api/courses", {}, token);
    setCourses(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function createCourse(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch(
      "/api/courses",
      {
        method: "POST",
        body: JSON.stringify({ title }),
      },
      token
    );
    setTitle("");
    load();
  }

  return (
    <AppShell>
      <h1>Manage Courses</h1>

      <form onSubmit={createCourse}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul course"
          required
        />
        <button type="submit">Tambah</button>
      </form>

      <ul>
        {courses.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </AppShell>
  );
}
