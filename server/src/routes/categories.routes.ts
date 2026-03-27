import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { user_categoriesCreateSchema } from "../validators/user_categories.validator.js";
import {
  createUserCategory,
  deleteUserCategoryById,
  getUserCategories,
  getUserCategoryById,
  updateUserCategory,
} from "../services/user/categories.service.js";
import { checkUserAdmin } from "../utils/checkAdmin.js";
import type { ContextWithPrisma } from "../types/index.js";

const categoriesRouter = new Hono<ContextWithPrisma>();

categoriesRouter.post(
  "/",
  zValidator("json", user_categoriesCreateSchema),
  async (c) => {
    const prisma = c.get("prisma");
    const payload = c.get("jwtPayload");
    checkUserAdmin(payload.user_category, [2]);
    const data = c.req.valid("json");
    const new_category = await createUserCategory(prisma, data);
    return c.json({ message: "Категория создана", new_category }, 201);
  },
);

categoriesRouter.get("/", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  checkUserAdmin(payload.user_category, [2]);
  const categories = await getUserCategories(prisma);
  return c.json({ message: "Категории получены", categories }, 200);
});

categoriesRouter.put(
  "/:id",
  zValidator("json", user_categoriesCreateSchema),
  async (c) => {
    const prisma = c.get("prisma");
    const payload = c.get("jwtPayload");
    const id = parseInt(c.req.param("id"));
    checkUserAdmin(payload.user_category, [2]);
    const data = c.req.valid("json");
    const updated = await updateUserCategory(prisma, data, id);
    return c.json({ message: "Категория обновлена", updated }, 200);
  },
);

categoriesRouter.get("/:id", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const id = parseInt(c.req.param("id"));
  checkUserAdmin(payload.user_category, [2]);
  const category = await getUserCategoryById(prisma, id);
  return c.json({ message: "Категория получена", category }, 200);
});

categoriesRouter.delete("/:id", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const id = parseInt(c.req.param("id"));
  checkUserAdmin(payload.user_category, [2]);
  const deleted = await deleteUserCategoryById(prisma, id);
  return c.json({ message: "Категория удалена", deleted }, 200);
});

export default categoriesRouter;
