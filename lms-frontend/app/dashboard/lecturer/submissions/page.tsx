"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function LecturerSubmissions() {
  const token = getTokenClient();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/api/submissions", {}, token).then(setItems);
  }, [token]);

  return (
    <AppShell>
      <h1>Submissions</h1>
      <ul>
        {items.map((s) => (
          <li key={s.id}>
            {s.assignment?.title} — {s.student?.email}
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
