"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function SubmitTask() {
  const router = useRouter();
  const token = getTokenClient();
  const [assignmentId, setAssignmentId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  async function loadAssignments() {
    setLoading(true);
    setError("");
    try {
      // Fetch enrollments dulu
      const enrollments = await apiFetch<any[]>(
        "/api/enrollments/me",
        {},
        token,
      );
      const enrolledCourseIds = enrollments?.map((e) => e.courseId) || [];

      // Fetch semua assignments
      const list = await apiFetch<any[]>("/api/assignments", {}, token);

      // Filter hanya assignments dari courses yang di-enroll, belum di-submit, dan belum overdue
      const now = new Date();
      const filtered = (list || []).filter((a) => {
        const isEnrolled = enrolledCourseIds.includes(a.course?.id);
        const notSubmitted = !a.isSubmitted;
        // Cek overdue: jika ada dueDate dan sudah lewat, exclude
        let notOverdue = true;
        if (a.dueDate) {
          const due = new Date(a.dueDate);
          notOverdue = due >= now;
        }
        return isEnrolled && notSubmitted && notOverdue;
      });

      setAssignments(filtered);
      // Reset selection if current selection is no longer valid
      if (!filtered.find((a) => String(a.id) === String(assignmentId))) {
        setAssignmentId("");
      }
    } catch (err: any) {
      console.error("Failed to load assignments", err);
      setError(err?.message || "Gagal memuat assignments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssignments();
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!file) {
        alert("Silakan pilih file untuk dikirim.");
        return;
      }

      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("file", file);

      await apiFetch(
        "/api/submissions",
        { method: "POST", body: formData },
        token,
      );
      alert("Terkirim");
      setAssignmentId("");
      setFile(null);
      // Redirect to tasks page
      router.push("/dashboard/student/tasks");
    } catch (err: any) {
      alert(err?.message || "Gagal submit");
    }
  }

  return (
    <AppShell>
      <h1 className="submit-assignment-title">Submit Assignment</h1>
      {error && (
        <div
          style={{
            marginBottom: 20,
            padding: 12,
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            color: "#991b1b",
          }}
        >
          {error}
          <button
            onClick={() => loadAssignments()}
            style={{
              marginLeft: 12,
              background: "#991b1b",
              color: "white",
              border: "none",
              borderRadius: 4,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}
      <div className="submit-card">
        <form onSubmit={submit} className="submit-form">
          <div className="form-group">
            <label className="form-label">Pilih Assignment</label>
            <select
              className="form-input"
              disabled={loading || error !== ""}
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              required
            >
              <option value="">
                {loading ? "Loading..." : "-- Pilih Assignment --"}
              </option>
              {assignments.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Upload File</label>
            <input
              className="form-input"
              type="file"
              accept="*/*"
              disabled={loading || error !== ""}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </AppShell>
  );
}
