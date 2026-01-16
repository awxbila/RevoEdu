"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function SubmitTask() {
  const token = getTokenClient();
  const [assignmentId, setAssignmentId] = useState<number | "">("");
  const [content, setContent] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch(
      "/api/submissions",
      {
        method: "POST",
        body: JSON.stringify({ assignmentId, content }),
      },
      token
    );
    alert("Terkirim");
    setAssignmentId("");
    setContent("");
  }

  return (
    <AppShell>
      <h1>Submit Tugas</h1>
      <form onSubmit={submit}>
        <input
          placeholder="Assignment ID"
          value={assignmentId}
          onChange={(e) => setAssignmentId(Number(e.target.value))}
          required
        />
        <textarea
          placeholder="Isi submission"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Kirim</button>
      </form>
    </AppShell>
  );
}
