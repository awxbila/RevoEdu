"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTokenClient } from "@/lib/auth";
import { decodeJwtPayload } from "@/lib/jwt";
import { dashboardPathByRole } from "@/lib/constants";

export default function DashboardRoot() {
  const router = useRouter();

  useEffect(() => {
    const token = getTokenClient();
    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = decodeJwtPayload(token);
    const role = payload?.role || payload?.roles || payload?.user?.role; // fallback
    router.replace(dashboardPathByRole(role));
  }, [router]);

  return <div style={{ padding: 20 }}>Loading dashboard...</div>;
}
