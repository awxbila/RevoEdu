"use client";

import UserMenu from "@/components/common/UserMenu";
import { decodeJwtPayload } from "@/lib/jwt";
import { getTokenClient } from "@/lib/auth";

export default function Topbar() {
  const token = getTokenClient();
  const user = decodeJwtPayload(token || "");
  const name = user?.name || user?.email || "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div className="brand-badge">{initial}</div>
        <UserMenu />
      </div>
    </header>
  );
}
