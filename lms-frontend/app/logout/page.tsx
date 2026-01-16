"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearToken();
    router.replace("/login");
  }, [router]);

  return <div style={{ padding: 20 }}>Logging out...</div>;
}
