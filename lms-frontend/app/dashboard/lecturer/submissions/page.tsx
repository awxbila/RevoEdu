"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function LecturerSubmissions() {
  const token = getTokenClient();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any[]>("/api/assignments", {}, token).then((asgs) => {
      setAssignments(asgs);
      // Fetch submissions untuk setiap assignment
      Promise.all(
        asgs.map((asg) =>
          apiFetch<any[]>(`/api/assignments/${asg.id}/submissions`, {}, token)
            .then((subs) => subs.map((s) => ({ ...s, assignmentId: asg.id })))
            .catch(() => []),
        ),
      ).then((allSubs) => setSubmissions(allSubs.flat()));
    });
    apiFetch<any[]>("/api/enrollments", {}, token).then(setEnrollments);
    // Tidak perlu fetch users, gunakan enrollments untuk info mahasiswa
  }, [token]);

  return (
    <AppShell>
      <h1>Assignment Submissions</h1>
      {assignments.map((asg) => {
        const courseEnrolls = Array.isArray(enrollments)
          ? enrollments.filter((e) => e.courseId === asg.courseId)
          : [];
        const asgSubmissions = Array.isArray(submissions)
          ? submissions.filter((s) => s.assignmentId === asg.id)
          : [];
        return (
          <div
            key={asg.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
              marginBottom: 32,
              padding: 20,
            }}
          >
            <h2 style={{ margin: 0 }}>{asg.title}</h2>
            <div style={{ color: "#888", fontSize: 14 }}>{asg.brief}</div>
            <div style={{ margin: "8px 0 16px 0" }}>
              <b>Submit:</b> {asgSubmissions.length}/{courseEnrolls.length}{" "}
              student
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 8,
              }}
            >
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={{ textAlign: "left", padding: 6 }}>Student</th>
                  <th style={{ textAlign: "left", padding: 6 }}>Email</th>
                  <th style={{ textAlign: "left", padding: 6 }}>Answer/File</th>
                  <th style={{ textAlign: "left", padding: 6 }}>
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody>
                {asgSubmissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        color: "#888",
                        textAlign: "center",
                        padding: 12,
                      }}
                    >
                      Belum ada submission
                    </td>
                  </tr>
                ) : (
                  asgSubmissions.map((sub) => {
                    const student = users.find((u) => u.id === sub.studentId);
                    return (
                      <tr key={sub.id}>
                        <td style={{ padding: 6 }}>{student?.name || "-"}</td>
                        <td style={{ padding: 6 }}>{student?.email || "-"}</td>
                        <td style={{ padding: 6 }}>
                          {sub.fileName || sub.answer || "-"}
                        </td>
                        <td style={{ padding: 6 }}>
                          {sub.submittedAt
                            ? new Date(sub.submittedAt).toLocaleString("id-ID")
                            : "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </AppShell>
  );
}
