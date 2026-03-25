export async function registerUser(data: {
  login: string;
  password: string;
  nickname: string;
}) {
  const req = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
  });
  const res = await req.json();
  return res;
}
