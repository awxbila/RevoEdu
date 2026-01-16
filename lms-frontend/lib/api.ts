const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

type ApiError = { message?: string } & Record<string, any>;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Request gagal (${res.status})`);
  }

  return res.json();
}
