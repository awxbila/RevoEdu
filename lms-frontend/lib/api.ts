const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
type ApiError = { message?: string } & Record<string, any>;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let err: ApiError = {};
    try {
      err = await res.json();
    } catch {
      // If response is not JSON, try to get text
      err.message = await res.text().catch(() => `HTTP ${res.status}`);
    }
    const errorMsg =
      err?.message || err?.error || `Request gagal (${res.status})`;
    // Suppress console error untuk expected failures (400, 401, 403, 409, 500) karena itu expected behavior
    if (
      res.status !== 400 &&
      res.status !== 401 &&
      res.status !== 403 &&
      res.status !== 409 &&
      res.status !== 500
    ) {
      console.error(`API Error [${res.status}]:`, errorMsg, err);
    }
    throw new Error(errorMsg);
  }

  return res.json();
}
