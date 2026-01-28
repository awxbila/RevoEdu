"use client";

import { useRouter } from "next/navigation";
import { useState, type CSSProperties, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import "./login.module.css";

type LoginResponse = { access_token: string };

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showLogin, setShowLogin] = useState(true);

  // Register form states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const backgroundImage = "url('/login-bg.png')"; // place your image at /public/login-bg.png
  const backgroundStyle: CSSProperties = {
    minHeight: "100vh",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), ${backgroundImage}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 24,
    paddingRight: 48,
  };

  const cardStyle: CSSProperties = {
    width: "100%",
    maxWidth: 420,
    background: "transparent",
    borderRadius: 12,
    padding: 24,
    color: "#fff",
  };

  async function onSubmit(e: FormEvent) {
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
      const normalized = errorMsg.toLowerCase();
      if (normalized.includes("email atau password")) {
        setError("Email atau password salah");
      } else if (
        normalized.includes("not found") ||
        normalized.includes("tidak ditemukan")
      ) {
        setError("Akun tidak terdaftar. Silakan daftar terlebih dahulu.");
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }

  const resetErrors = () => {
    setError("");
    setLoading(false);
  };

  const resetLoginForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    resetErrors();
  };

  const resetRegisterForm = () => {
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    setRegRole("");
    setShowRegPassword(false);
    resetErrors();
  };

  const goToLogin = () => {
    resetLoginForm();
    setShowLogin(true);
  };

  const goToRegister = () => {
    resetRegisterForm();
    setShowLogin(false);
  };

  if (!showLogin) {
    return (
      <div style={backgroundStyle}>
        <main style={cardStyle}>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginBottom: 24,
              color: "#164d8d",
            }}
          >
            Register
          </h1>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setLoading(true);
              try {
                await apiFetch("/api/auth/register", {
                  method: "POST",
                  body: JSON.stringify({
                    name: regName,
                    email: regEmail,
                    password: regPassword,
                    role: regRole,
                  }),
                });
                alert("Registrasi berhasil! Silakan login.");
                goToLogin();
                setRegName("");
                setRegEmail("");
                setRegPassword("");
                setRegRole("student");
              } catch (err: any) {
                setError(err?.message || "Registrasi gagal");
              } finally {
                setLoading(false);
              }
            }}
            style={{ display: "grid", gap: 10 }}
          >
            <label style={{ color: "#fff" }}>
              Nama
              <input
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                type="text"
                required
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 6,
                  boxSizing: "border-box",
                  border: "none",
                  borderRadius: 4,
                  background: "#D2B48C",
                  color: "#fff",
                }}
              />
            </label>

            <label style={{ color: "#fff" }}>
              Email
              <input
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                type="email"
                required
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 6,
                  boxSizing: "border-box",
                  border: "none",
                  borderRadius: 4,
                  background: "#D2B48C",
                  color: "#fff",
                }}
              />
            </label>

            <label style={{ color: "#fff" }}>
              Password
              <div style={{ position: "relative", marginTop: 6 }}>
                <input
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  type={showRegPassword ? "text" : "password"}
                  required
                  style={{
                    width: "100%",
                    padding: 10,
                    paddingRight: 40,
                    boxSizing: "border-box",
                    border: "none",
                    borderRadius: 4,
                    background: "#D2B48C",
                    color: "#fff",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  <img
                    src={
                      showRegPassword ? "/icons/eye.svg" : "/icons/eye-off.svg"
                    }
                    alt="Toggle password"
                    style={{ width: 18, height: 18 }}
                  />
                </button>
              </div>
            </label>

            <label style={{ color: "#fff" }}>
              Role
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 6,
                  boxSizing: "border-box",
                  border: "none",
                  borderRadius: 4,
                  background: "#D2B48C",
                  color: "#fff",
                }}
              >
                <option value="">Pilih Role</option>
                <option value="STUDENT">Student</option>
                <option value="LECTURER">Lecturer</option>
              </select>
            </label>

            {error && (
              <p
                style={{ color: "crimson", margin: "10px 0 0 0", fontSize: 14 }}
              >
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
                background: "#1e4e85",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "right" }}>
            <button
              onClick={goToLogin}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "#fff",
                textDecoration: "underline",
              }}
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <main style={cardStyle}>
        <h1
          style={{
            fontWeight: 700,
            marginBottom: 24,
            color: "#164d8d",
          }}
        >
          <div style={{ fontSize: 18 }}>Welcome to</div>
          <div style={{ fontSize: 48 }}>RevoEdu</div>
        </h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={{ position: "relative", marginTop: 6 }}>
            <img
              src="/icons/envelope.svg"
              alt="Email"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 18,
                height: 18,
              }}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
              style={{
                width: "100%",
                padding: "10px 10px 10px 40px",
                boxSizing: "border-box",
                border: "none",
                borderRadius: 4,
                background: "#D2B48C",
                color: "#fff",
              }}
            />
          </div>

          <div style={{ position: "relative", marginTop: 6 }}>
            <img
              src="/icons/lock.svg"
              alt="Password"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 18,
                height: 18,
                zIndex: 10,
              }}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              style={{
                width: "100%",
                padding: "10px 40px 10px 40px",
                boxSizing: "border-box",
                border: "none",
                borderRadius: 4,
                background: "#D2B48C",
                color: "#fff",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <img
                src={showPassword ? "/icons/eye.svg" : "/icons/eye-off.svg"}
                alt="Toggle password"
                style={{ width: 18, height: 18 }}
              />
            </button>
          </div>

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
              background: "#1e4e85",
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
          style={{
            marginTop: 24,
            paddingTop: 24,
            borderTop: "1px solid #eee",
          }}
        >
          <p style={{ marginBottom: 12, color: "#fff" }}>Belum punya akun?</p>
          <button
            onClick={goToRegister}
            style={{
              width: "100%",
              padding: 12,
              fontWeight: 700,
              background: "#1e4e85",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>
      </main>
    </div>
  );
}
