export async function authFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  if (!headers.has("Content-type")) {
    headers.set("Content-type", "application/json");
  }

  if (token !== null && token !== "") {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`http://localhost:3000/${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
}
