"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { decodeJwtPayload } from "@/lib/jwt";
import { getTokenClient } from "@/lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const token = getTokenClient();
  const role = decodeJwtPayload(token || "")?.role;

  const menus =
    role === "LECTURER"
      ? [
          { href: "/dashboard/lecturer", label: "Beranda" },
          { href: "/dashboard/lecturer/courses", label: "Push Courses" },
          { href: "/dashboard/lecturer/activity", label: "Aktivitas" },
          { href: "/dashboard/lecturer/assignments", label: "Memberi Tugas" },
          { href: "/dashboard/lecturer/submissions", label: "Submission" },
        ]
      : [
          { href: "/dashboard/student", label: "Beranda" },
          { href: "/dashboard/student/tasks", label: "Rekap Tugas" },
          { href: "/dashboard/student/submit", label: "Upload/Submit" },
          { href: "/dashboard/student/courses", label: "Semua Courses" },
          { href: "/dashboard/student/activity", label: "Aktivitas" },
        ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-badge">L</div>
        <div>
          LMS
          <div className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
            {role === "LECTURER" ? "Lecturer Panel" : "Student Panel"}
          </div>
        </div>
      </div>

      <nav className="nav">
        {menus.map((m) => {
          const active = pathname === m.href;
          return (
            <Link
              key={m.href}
              href={m.href}
              style={{
                background: active ? "rgba(37,99,235,.10)" : undefined,
                color: active ? "var(--brand)" : undefined,
                fontWeight: active ? 800 : 700,
              }}
            >
              {m.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
