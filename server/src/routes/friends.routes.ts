import { Hono } from "hono";
import {
  acceptFriendRequest,
  getAllFriendships,
  sendFriendRequest,
} from "../services/friendships/friendship.service.js";
import type { ContextWithPrisma } from "../types/index.js";

const friendsRouter = new Hono<ContextWithPrisma>();

friendsRouter.get("/", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const friends = await getAllFriendships(prisma, payload.id);
  return c.json({ message: "Друзья получены", friends }, 200);
});

friendsRouter.post("/:id", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const id = parseInt(c.req.param("id"));
  const friendRequest = await sendFriendRequest(prisma, payload.id, id);
  return c.json({ message: "Заявка отправлена", friendRequest }, 201);
});

friendsRouter.put("/accept/:requestId", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const id = parseInt(c.req.param("requestId"));
  const acceptRequest = await acceptFriendRequest(prisma, id, payload.id);
  return c.json({ message: "Заявка принята", acceptRequest }, 200);
});

export default friendsRouter;
