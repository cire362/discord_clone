import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { userEditSchema } from "../validators/user.validator.js";
import {
  deleteUserById,
  getUserById,
  getUsers,
  searchUsers,
  updateProfile,
} from "../services/user/profile.service.js";
import { checkUserAdmin } from "../utils/checkAdmin.js";
import { HTTPException } from "hono/http-exception";
import type { ContextWithPrisma } from "../types/index.js";

const usersRouter = new Hono<ContextWithPrisma>();

usersRouter.get("/", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  checkUserAdmin(payload.user_category, [2]);
  const users = await getUsers(prisma);
  return c.json({ message: "Пользователи получены", users }, 200);
});

usersRouter.get("/search", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const query = c.req.query("q") || "";
  const users = await searchUsers(prisma, query, payload.id);
  return c.json({ message: "Пользователи найдены", users }, 200);
});

usersRouter.get("/:id", async (c) => {
  const prisma = c.get("prisma");
  const id = parseInt(c.req.param("id"));
  const user = await getUserById(prisma, id);
  return c.json({ message: "Пользователь получен", user }, 200);
});

usersRouter.delete("/:id", async (c) => {
  const prisma = c.get("prisma");
  const id = parseInt(c.req.param("id"));
  const payload = c.get("jwtPayload");
  if (payload.id != id && payload.user_category != 2) {
    throw new HTTPException(403, { message: "Нет доступа" });
  }
  const deleted = await deleteUserById(prisma, id);
  return c.json({ message: "Пользователь удален", deleted }, 200);
});

usersRouter.put("/edit/:id", zValidator("json", userEditSchema), async (c) => {
  const prisma = c.get("prisma");
  const data = c.req.valid("json");
  const id = parseInt(c.req.param("id"));
  const payload = c.get("jwtPayload");

  if (payload.id !== id) {
    throw new HTTPException(403, { message: "Доступ запрещен" });
  }

  const updated = await updateProfile(prisma, id, data);
  return c.json({ message: "Пользователь обновлен", updated }, 200);
});

export default usersRouter;
