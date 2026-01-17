"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { getTokenClient } from "@/lib/auth";

export default function SubmitTask() {
  const token = getTokenClient();
  const [assignmentId, setAssignmentId] = useState<string>("");
  const [linkSubmission, setLinkSubmission] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch(
      "/api/submissions",
      {
        method: "POST",
        body: JSON.stringify({ assignmentId, linkSubmission }),
      },
      token
    );
    alert("Terkirim");
    setAssignmentId("");
    setLinkSubmission("");
  }

  return (
    <AppShell>
      <h1 className="submit-assignment-title">Submit Assignment</h1>
      <div className="submit-card">
        <form onSubmit={submit} className="submit-form">
          <div className="form-group">
            <label className="form-label">Assignment ID</label>
            <input
              className="form-input"
              type="text"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Link Submission</label>
            <input
              className="form-input"
              type="url"
              placeholder="https://..."
              value={linkSubmission}
              onChange={(e) => setLinkSubmission(e.target.value)}
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
