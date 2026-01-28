"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

type Assignment = {
  id: number;
  title: string;
  description?: string;
  brief?: string;
  dueDate?: string;
  isSubmitted?: boolean;
  code?: string;
  course?: {
    id: number;
    title: string;
  };
};

export default function StudentTasks() {
  const token = getTokenClient();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedBrief, setSelectedBrief] = useState<{
    title: string;
    brief: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Fetch enrollments dulu
        const enrollments = await apiFetch<any[]>(
          "/api/enrollments/me",
          {},
          token
        );
        const enrolledCourseIds = enrollments?.map((e) => e.courseId) || [];

        // Fetch semua assignments
        const allAssignments = await apiFetch<Assignment[]>(
          "/api/assignments",
          {},
          token
        );

        // Filter hanya assignments dari courses yang di-enroll
        const filteredAssignments =
          allAssignments?.filter((a) =>
            enrolledCourseIds.includes(a.course?.id)
          ) || [];

        if (mounted) {
          setAssignments(filteredAssignments);
          setError("");
        }
      } catch (err: any) {
        console.error(err?.message || "Gagal memuat assignments");
        if (mounted) setError(err?.message || "Gagal memuat assignments");
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
      ) : error ? (
        <div className="assignment-empty" style={{ color: "#b91c1c" }}>
          {error}
        </div>
      ) : assignments.length === 0 ? (
        <div className="assignment-empty">Belum ada assignment.</div>
      ) : (
        <div className="assignment-card">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Assignment ID</th>
                <th>Assignment Title</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Brief</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, idx) => {
                const now = new Date();
                const due = a.dueDate ? new Date(a.dueDate) : null;
                const isOverdue = !a.isSubmitted && due && now > due;
                const statusLabel = a.isSubmitted
                  ? "Submitted"
                  : isOverdue
                  ? "Overdue"
                  : "Unsubmitted";
                const statusClass = a.isSubmitted
                  ? "status-submitted"
                  : isOverdue
                  ? "status-overdue"
                  : "status-pending";
                return (
                  <tr key={a.id}>
                    <td>{a.course?.title || a.course?.id || "-"}</td>
                    <td>{String(a.id).slice(0, 8)}</td>
                    <td>{a.title || "-"}</td>
                    <td>
                      {a.dueDate
                        ? new Date(a.dueDate).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      <span className={`status-badge ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td>
                      {a.brief ? (
                        <button
                          className="btn-view"
                          type="button"
                          onClick={() =>
                            setSelectedBrief({
                              title: a.title,
                              brief: a.brief || "",
                            })
                          }
                        >
                          View Brief
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {selectedBrief && (
            <div className="assignment-brief">
              <h3>Brief: {selectedBrief.title}</h3>
              <p>{selectedBrief.brief}</p>
              <button
                className="btn-cancel"
                type="button"
                onClick={() => setSelectedBrief(null)}
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
