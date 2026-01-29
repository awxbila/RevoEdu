"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";

import { getTokenClient } from "@/lib/auth";
import { decodeJwtPayload } from "@/lib/jwt";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getTokenClient();
    if (!token) {
      setLoading(false);
      return;
    }
    const decoded = decodeJwtPayload(token);
    setUser(decoded);
    setLoading(false);
  }, []);

  if (loading)
    return (
      <AppShell>
        <div>Loading...</div>
      </AppShell>
    );

  return (
    <AppShell>
      <h1>Profile</h1>
      {user ? (
        <>
          <p>
            <b>Email:</b> {user.email || "-"}
          </p>
          <p>
            <b>Role:</b>{" "}
            {user.role
              ? user.role === "LECTURER"
                ? "Dosen"
                : "Mahasiswa"
              : "-"}
          </p>
          <p style={{ opacity: 0.7 }}>
            (Kalau backend kamu punya endpoint profil update, nanti kita sambung
            form edit di sini.)
          </p>
        </>
      ) : (
        <p>Tidak ada data user</p>
      )}
    </AppShell>
  );
}
