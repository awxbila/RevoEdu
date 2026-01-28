"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { decodeJwtPayload } from "@/lib/jwt";
import { getTokenClient } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    const token = getTokenClient();
    setRole(decodeJwtPayload(token || "")?.role || null);
  }, []);

  if (!role) {
    // Prevent SSR/CSR mismatch by not rendering menu until role is known
    return null;
  }

  const menus =
    role === "LECTURER"
      ? [
          { href: "/dashboard/lecturer", label: "Beranda" },
          { href: "/dashboard/lecturer/courses", label: "Push Courses" },
          { href: "/dashboard/lecturer/activity", label: "Lecturer Activity" },
          { href: "/dashboard/lecturer/assignments", label: "Push Assignment" },
          { href: "/dashboard/lecturer/submissions", label: "Submission" },
          { href: "/dashboard/lecturer/quizzes", label: "Quiz" },
        ]
      : [
          { href: "/dashboard/student", label: "Beranda" },
          { href: "/dashboard/student/tasks", label: "Assignment" },
          { href: "/dashboard/student/submit", label: "Submit Assignment" },
          { href: "/dashboard/student/courses", label: "Course Info" },
          { href: "/dashboard/student/activity", label: "Study Activity" },
          { href: "/dashboard/student/quizzes", label: "Quiz" },
        ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div>
          <span style={{ color: "#1f2d6b", fontWeight: 800, fontSize: 30 }}>
            Revo
          </span>
          <span style={{ color: "#d6a96d", fontWeight: 800, fontSize: 30 }}>
            Edu
          </span>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#9ca3af",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Revo LMS Portal
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
