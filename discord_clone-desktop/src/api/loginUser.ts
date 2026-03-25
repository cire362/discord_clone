export async function loginUser(data: { login: string; password: string }) {
  const req = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
  const res = await req.json();
  return res;
}
