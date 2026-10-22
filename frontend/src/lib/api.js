export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

const TOKEN_KEY = "inviteonline_token";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable (private mode) */
  }
};

// JSON fetch wrapper. Throws Error(message) with `.status` on non-2xx.
export async function api(path, { method = "GET", body, headers = {}, auth = true, signal } = {}) {
  const token = auth ? getToken() : null;
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    if (e.name === "AbortError") throw e;
    throw new Error("Cannot reach the server. Please check your connection.");
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

// kind: "image" | "audio". Returns { url, ... }.
export async function uploadFile(kind, file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/uploads/${kind}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
}

// Downloads an authenticated file (e.g. CSV export).
export async function downloadFile(path, filename) {
  const res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const inviteUrl = (slug) => `${SITE_URL}/i/${slug}`;
