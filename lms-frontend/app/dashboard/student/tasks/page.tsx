"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

type Assignment = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  isSubmitted?: boolean;
  course?: {
    id: number;
    title: string;
  };
};

export default function StudentTasks() {
  const token = getTokenClient();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiFetch<Assignment[]>(
          "/api/assignments",
          {},
          token
        );
        if (mounted) setAssignments(data || []);
      } catch (err: any) {
        console.error(err?.message || "Gagal memuat assignments");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <AppShell>
      <h1 className="assignment-title">Assignment</h1>

      {loading ? (
        <div className="assignment-empty">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="assignment-empty">Belum ada assignment.</div>
      ) : (
        <div className="assignment-card">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Assignment ID</th>
                <th>Assignment Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, idx) => (
                <tr key={a.id}>
                  <td>{idx + 1}</td>
                  <td>{a.id || "-"}</td>
                  <td>{a.title || "-"}</td>
                  <td>
                    <span className="status-badge">
                      {a.isSubmitted ? "Submitted" : "Unsubmit"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
