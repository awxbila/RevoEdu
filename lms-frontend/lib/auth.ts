const TOKEN_COOKIE = "token";

export function setToken(token: string) {
  // cookie (biar middleware bisa baca)
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
    token
  )}; path=/; max-age=604800`; // 7 hari
  // localStorage (biar apiFetch gampang ambil)
  localStorage.setItem(TOKEN_COOKIE, token);
}

export function getTokenClient(): string | null {
  return localStorage.getItem(TOKEN_COOKIE);
}

export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  localStorage.removeItem(TOKEN_COOKIE);
}
