export async function registerUser(data: {
  login: string;
  password: string;
  nickname: string;
}) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const req = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
  const res = await req.json();
  return res;
}
