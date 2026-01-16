"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function StudentActivity() {
  const [items, setItems] = useState<any[]>([]);
  const token = getTokenClient();

  useEffect(() => {
    apiFetch<any[]>("/api/enrollments/me", {}, token).then(setItems);
  }, [token]);

  return (
    <AppShell>
      <h1>Aktivitas</h1>
      <ul>
        {items.map((e) => (
          <li key={e.id}>{e.course?.title}</li>
        ))}
      </ul>
    </AppShell>
  );
}
