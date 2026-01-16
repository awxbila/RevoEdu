"use client";

import Link from "next/link";
import { useState } from "react";
import { decodeJwtPayload } from "@/lib/jwt";
import { getTokenClient } from "@/lib/auth";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const token = getTokenClient();
  const user = decodeJwtPayload(token || "");
  const name = user?.name || user?.email || "User";

  return (
    <div style={{ position: "relative" }}>
      <button
        className="btn"
        style={{
          background: "#fff",
          color: "var(--text)",
          border: "1px solid var(--line)",
        }}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {name} ▾
      </button>

      {open && (
        <div
          className="card"
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            width: 180,
            padding: 10,
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <Link href="/profile" onClick={() => setOpen(false)}>
              Profile
            </Link>
            <Link
              href="/logout"
              onClick={() => setOpen(false)}
              style={{ color: "crimson" }}
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
