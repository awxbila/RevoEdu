"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function CourseModules() {
  const token = getTokenClient();
  const params = useParams<{ courseId?: string }>();
  const courseId = params?.courseId;
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!courseId) return;
      try {
        const data = await apiFetch<any[]>(
          `/api/courses/${courseId}/modules`,
          {},
          token
        );
        if (mounted) {
          setModules(data || []);
          setError("");
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || "Gagal memuat modul");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [courseId, token]);

  return (
    <AppShell>
      <h1 className="assignment-title">Module Course</h1>
      {loading ? (
        <div className="assignment-empty">Loading modules...</div>
      ) : error ? (
        <div className="assignment-empty" style={{ color: "#b91c1c" }}>
          {error}
        </div>
      ) : modules.length === 0 ? (
        <div className="assignment-empty">Belum ada modul.</div>
      ) : (
        <div className="assignment-card">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Judul Modul</th>
                <th>Tipe</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m, idx) => (
                <tr key={m.id}>
                  <td>{idx + 1}</td>
                  <td>{m.title}</td>
                  <td>{m.type?.toUpperCase()}</td>
                  <td>
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb" }}
                    >
                      Buka
                    </a>
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
