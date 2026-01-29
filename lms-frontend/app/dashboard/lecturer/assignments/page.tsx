"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function LecturerAssignments() {
  const token = getTokenClient();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState<number | "">("");
  const [dueDate, setDueDate] = useState<string>("");
  const [brief, setBrief] = useState<string>("");

  async function load() {
    const data = await apiFetch<any[]>("/api/assignments", {}, token);
    setAssignments(data);
  }

  useEffect(() => {
    load();
    apiFetch<any[]>("/api/courses/my-courses", {}, token).then(setCourses);
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch(
      "/api/assignments",
      {
        method: "POST",
        body: JSON.stringify({
          title,
          courseId,
          dueDate,
          description: brief || "",
        }),
      },
      token,
    );
    setTitle("");
    setCourseId("");
    setDueDate("");
    setBrief("");
    load();
  }

  return (
    <AppShell>
      <h1 className="assignment-title">Beri Tugas</h1>

      <div className="submit-card">
        <form onSubmit={create} className="submit-form">
          <div className="form-group">
            <label className="form-label">Judul Tugas</label>
            <input
              className="form-input"
              placeholder="Contoh: Membuat Halaman Login"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="form-input"
              value={courseId}
              onChange={(e) => setCourseId(Number(e.target.value) || "")}
              required
            >
              <option value="">Pilih Course</option>
              {courses.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              className="form-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brief / Catatan Tugas</label>
            <textarea
              className="form-input"
              placeholder="Jelaskan singkat tentang tugas yang harus dikerjakan..."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={4}
            />
          </div>

          <button type="submit" className="submit-btn">
            Tambah Tugas
          </button>
        </form>
      </div>

      <h2 className="assignment-title" style={{ marginTop: 32 }}>
        Daftar Tugas
      </h2>
      <div className="assignment-card">
        <table className="assignment-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Kode</th>
              <th>Deadline</th>
              <th>Brief</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: 20, color: "#666" }}
                >
                  Belum ada tugas yang dibuat
                </td>
              </tr>
            ) : (
              assignments.map((a, idx) => {
                const isOverdue = a.dueDate && new Date(a.dueDate) < new Date();
                return (
                  <tr
                    key={a.id}
                    style={isOverdue ? { background: "#fee2e2" } : {}}
                  >
                    <td>{idx + 1}</td>
                    <td>{a.title}</td>
                    <td>{a.code || "-"}</td>
                    <td>
                      {a.dueDate
                        ? new Date(a.dueDate).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      {a.brief ? (
                        <span style={{ fontSize: 12, color: "#666" }}>
                          {a.brief.length > 50
                            ? a.brief.substring(0, 50) + "..."
                            : a.brief}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
