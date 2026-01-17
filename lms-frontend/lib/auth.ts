const TOKEN_COOKIE = "token";

export function setToken(token: string) {
  // cookie (biar middleware bisa baca)
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
      token
    )}; path=/; max-age=604800`; // 7 hari
  }
  // localStorage (biar apiFetch gampang ambil)
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_COOKIE, token);
  }
}

export function getTokenClient(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_COOKIE);
  } catch (err) {
    return null;
  }
}

export function clearToken() {
  if (typeof document !== "undefined") {
    document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_COOKIE);
  }
}
