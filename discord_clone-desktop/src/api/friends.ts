import { authFetch } from "./authFetch";

export async function searchUsers(query: string) {
  const res = await authFetch(`users/search?q=${encodeURIComponent(query)}`);
  return res;
}

export async function sendFriendRequest(userId: number) {
  const res = await authFetch(`users/friends/${userId}`, {
    method: "POST",
  });
  return res;
}

export async function getFriends() {
  const res = await authFetch("users/friends");
  return res;
}

export async function acceptFriendRequest(requestId: number) {
  const res = await authFetch(`users/friends/accept/${requestId}`, {
    method: "PUT",
  });
  return res;
}
