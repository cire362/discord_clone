export async function authFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  if (!headers.has("Content-type")) {
    headers.set("Content-type", "application/json");
  }

  if (token !== null && token !== "") {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
}
