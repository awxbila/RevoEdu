"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";

type LoginResponse = { access_token: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("lecturer@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showLogin, setShowLogin] = useState(true);
  const backgroundImage = "url('/login-bg.jpg')"; // let user drop their own image into /public/login-bg.jpg
  const backgroundStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), ${backgroundImage}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  };
  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.92)",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
    backdropFilter: "blur(6px)",
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setToken(data.access_token);
      router.replace("/dashboard");
    } catch (err: any) {
      const errorMsg = err?.message || "Login gagal";
      if (
        errorMsg.includes("not found") ||
        errorMsg.includes("tidak ditemukan")
      ) {
        setError("Akun tidak terdaftar. Silakan daftar terlebih dahulu.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!showLogin) {
    return (
      <div style={backgroundStyle}>
        <main style={cardStyle}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "#0070f3",
                textDecoration: "underline",
              }}
            >
              ← Kembali
            </button>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
            Daftar Akun Baru
          </h1>
          <p style={{ marginBottom: 24, color: "#666" }}>
            Fitur registrasi akan segera hadir. Silakan hubungi administrator
            untuk membuat akun.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <main style={cardStyle}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Login</h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                boxSizing: "border-box",
              }}
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              style={{
                width: "100%",
                padding: 10,
                marginTop: 6,
                boxSizing: "border-box",
              }}
            />
          </label>

          {error && (
            <p style={{ color: "crimson", margin: "10px 0 0 0", fontSize: 14 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 12,
              fontWeight: 700,
              marginTop: 8,
              background: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        <div
          style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #eee" }}
        >
          <p style={{ marginBottom: 12, color: "#666" }}>Belum punya akun?</p>
          <button
            onClick={() => setShowLogin(false)}
            style={{
              width: "100%",
              padding: 12,
              fontWeight: 700,
              background: "white",
              color: "#0070f3",
              border: "2px solid #0070f3",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>

        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            opacity: 0.8,
            textAlign: "center",
          }}
        >
          Demo: lecturer@example.com / password123
        </p>
      </main>
    </div>
  );
}
