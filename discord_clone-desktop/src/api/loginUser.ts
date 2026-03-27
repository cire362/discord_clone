export async function loginUser(data: { login: string; password: string }) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const req = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
  const res = await req.json();
  return res;
}
