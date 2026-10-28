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

// What to tell people when the server gave no message of its own (e.g. it's down, or a host page
// answered instead of the API).
export function friendlyStatus(status) {
  if (status === 401) return "Please log in to continue.";
  if (status === 403) return "You don't have access to this.";
  if (status === 404) return "We couldn't find that. It may have been deleted.";
  if (status === 413) return "That's too large to upload. Please choose a smaller file (photos under 4 MB work best).";
  if (status === 429) return "Too many attempts. Please wait a few minutes and try again.";
  if (status >= 500) return "Something went wrong on our side. Please try again in a moment.";
  return "Something went wrong. Please try again.";
}

const OFFLINE = "Can't reach the server. Please check your internet connection and try again.";

// JSON fetch wrapper. Throws Error(message) with `.status` and `.data` (response body) on non-2xx.
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
    throw new Error(OFFLINE);
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;
  if (!res.ok) {
    if (res.status === 401 && token) {
      setToken(null);
      if (typeof window !== "undefined") window.dispatchEvent(new Event("auth:expired"));
    }
    const err = new Error(data?.message || friendlyStatus(res.status));
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// kind: "image" | "audio". Returns { url, ... }.
export async function uploadFile(kind, file) {
  const form = new FormData();
  form.append("file", file);
  let res;
  try {
    res = await fetch(`${API_URL}/uploads/${kind}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    });
  } catch {
    throw new Error(OFFLINE);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || friendlyStatus(res.status));
  return data;
}

// Downloads an authenticated file (e.g. CSV export).
export async function downloadFile(path, filename) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  } catch {
    throw new Error(OFFLINE);
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || friendlyStatus(res.status));
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const inviteUrl = (slug) => `${SITE_URL}/i/${slug}`;
