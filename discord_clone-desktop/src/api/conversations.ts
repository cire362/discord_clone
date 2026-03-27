import { authFetch } from "./authFetch";

export async function getConversations() {
  const res = await authFetch("users/conversations");

  return res;
}
