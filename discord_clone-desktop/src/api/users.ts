import { authFetch } from "./authFetch";

export async function getUserById(id: number) {
  const res = await authFetch(`users/${id}`);
  return res;
}
