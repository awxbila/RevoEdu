"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function StudentTasks() {
  const token = getTokenClient();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/api/assignments", {}, token).then(setTasks);
  }, [token]);

  return (
    <AppShell>
      <h1>Rekap Tugas</h1>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </AppShell>
  );
}
