"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function LecturerAssignments() {
  const token = getTokenClient();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState<number | "">("");

  async function load() {
    const data = await apiFetch<any[]>("/api/assignments", {}, token);
    setAssignments(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch(
      "/api/assignments",
      {
        method: "POST",
        body: JSON.stringify({ title, courseId }),
      },
      token
    );
    setTitle("");
    setCourseId("");
    load();
  }

  return (
    <AppShell>
      <h1>Beri Tugas</h1>

      <form onSubmit={create}>
        <input
          placeholder="Judul tugas"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(Number(e.target.value))}
          required
        />
        <button type="submit">Tambah</button>
      </form>

      <ul>
        {assignments.map((a) => (
          <li key={a.id}>{a.title}</li>
        ))}
      </ul>
    </AppShell>
  );
}
