import type { Prisma } from "../../generated/prisma/client.js";

export const safeUserSelect = {
  id: true,
  login: true,
  nickname: true,
  status: true,
  avatar_url: true,
} satisfies Prisma.UserSelect;
