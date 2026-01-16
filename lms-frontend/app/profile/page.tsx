"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { getTokenClient } from "@/lib/auth";
import { decodeJwtPayload } from "@/lib/jwt";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getTokenClient();
    if (!token) return;
    setUser(decodeJwtPayload(token));
  }, []);

  return (
    <AppShell>
      <h1>Profile</h1>
      <p>
        <b>Email:</b> {user?.email || "-"}
      </p>
      <p>
        <b>Role:</b> {user?.role || "-"}
      </p>
      <p style={{ opacity: 0.7 }}>
        (Kalau backend kamu punya endpoint profil update, nanti kita sambung
        form edit di sini.)
      </p>
    </AppShell>
  );
}
