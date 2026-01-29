"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

interface QuizSubmissionsModalProps {
  quizId: string;
  open: boolean;
  onClose: () => void;
}

export default function QuizSubmissionsModal({
  quizId,
  open,
  onClose,
}: QuizSubmissionsModalProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const token = getTokenClient();
    apiFetch(`/api/quizzes/${quizId}/submissions`, {}, token)
      .then((data) => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, [quizId, open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          minWidth: 340,
          maxWidth: 420,
          padding: 24,
          boxShadow: "0 2px 16px #0002",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Daftar Student Submit</h2>
        {loading ? (
          <div>Loading...</div>
        ) : submissions.length === 0 ? (
          <div style={{ color: "#888" }}>
            Belum ada student yang submit quiz ini.
          </div>
        ) : (
          <table style={{ width: "100%", fontSize: 15 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 4 }}>Nama</th>
                <th style={{ textAlign: "left", padding: 4 }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td style={{ padding: 4 }}>
                    {s.studentName || s.name || s.studentId}
                  </td>
                  <td style={{ padding: 4 }}>
                    {typeof s.score === "number" ? s.score : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button style={{ marginTop: 18 }} onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  );
}
