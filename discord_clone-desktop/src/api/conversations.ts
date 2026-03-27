import { authFetch } from "./authFetch";

export async function getConversations() {
  const res = await authFetch("users/conversations");

  return res;
}

export async function getConversationMessages(conversationId: number) {
  const res = await authFetch(`users/conversations/${conversationId}/messages`);
  return res;
}
