import { PrismaClient } from "../generated/prisma/client.js";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  userEditSchema,
  userLoginSchema,
  userRegisterSchema,
} from "../validators/user.validator.js";
import {
  deleteUserById,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  updateProfile,
} from "../services/user.service.js";
import { user_categoriesCreateSchema } from "../validators/user_categories.validator.js";
import {
  createUserCategory,
  deleteUserCategoryById,
  getUserCategories,
  getUserCategoryById,
  updateUserCategory,
} from "../services/user_categories.service.js";
import { HTTPException } from "hono/http-exception";
import { jwt } from "hono/jwt";
import { checkUserAdmin } from "../utils/checkAdmin.js";

type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
    jwtPayload: {
      id: number;
      user_category: number;
      exp: number;
    };
  };
};

const userRouter = new Hono<ContextWithPrisma>();

userRouter.post(
  "/users/register",
  zValidator("json", userRegisterSchema),
  async (c) => {
    const prisma = c.get("prisma");
    const data = c.req.valid("json");
    const new_user = await registerUser(prisma, {
      ...data,
      user_category_id: 1,
    });
    return c.json({ message: "Пользователь зарегистрирован", new_user }, 201);
  },
);

userRouter.post(
  "/users/login",
  zValidator("json", userLoginSchema),
  async (c) => {
    const prisma = c.get("prisma");
    const data = c.req.valid("json");
    const token = await loginUser(prisma, data.login, data.password);
    return c.json({ message: "Успешная аутентификация", token }, 201);
  },
);

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new HTTPException(500, { message: "Ошибка сервера" });
}

userRouter.use("/users", jwt({ secret: secret, alg: "HS256" }));

userRouter.post(
  "/users/register/admin",
  zValidator("json", userRegisterSchema),
  async (c) => {
    const prisma = c.get("prisma");
    const payload = c.get("jwtPayload");
    const data = c.req.valid("json");
    checkUserAdmin(payload.user_category, [2]);
    const new_administrator = await registerUser(prisma, {
      ...data,
      user_category_id: 2,
    });
    return c.json(
      { message: "Администратор зарегистрирован", new_administrator },
      200,
    );
  },
);

userRouter.put(
  "/users/edit/:id",
  zValidator("json", userEditSchema),
  async (c) => {
    const prisma = c.get("prisma");
    const data = c.req.valid("json");
    const id = parseInt(c.req.param("id"));
    const payload = c.get("jwtPayload");

    if (payload.id !== id) {
      throw new HTTPException(403, { message: "Доступ запрещен" });
    }

    const updated = await updateProfile(prisma, id, data);
    return c.json({ message: "Пользователь обновлен", updated }, 200);
  },
);

userRouter.post(
  "/users/categories",
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

userRouter.put(
  "/users/categories/:id",
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

userRouter.get("/users/categories/:id", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const id = parseInt(c.req.param("id"));
  checkUserAdmin(payload.user_category, [2]);
  const category = await getUserCategoryById(prisma, id);
  return c.json({ message: "Категория получена", category }, 200);
});

userRouter.delete("/users/categories/:id", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const id = parseInt(c.req.param("id"));
  checkUserAdmin(payload.user_category, [2]);
  const deleted = await deleteUserCategoryById(prisma, id);
  return c.json({ message: "Категория удалена", deleted }, 200);
});

userRouter.get("/users/categories", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  checkUserAdmin(payload.user_category, [2]);
  const categories = await getUserCategories(prisma);
  return c.json({ message: "Категории получены", categories }, 200);
});

userRouter.get("/users", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  checkUserAdmin(payload.user_category, [2]);
  const users = await getUsers(prisma);
  return c.json({ message: "Пользователи получены", users }, 200);
});

userRouter.get("/users/:id", async (c) => {
  const prisma = c.get("prisma");
  const id = parseInt(c.req.param("id"));
  const user = await getUserById(prisma, id);
  return c.json({ message: "Пользователь получен", user }, 200);
});

userRouter.delete("/users/:id", async (c) => {
  const prisma = c.get("prisma");
  const id = parseInt(c.req.param("id"));
  const payload = c.get("jwtPayload");
  if (payload.id != id && payload.user_category != 2) {
    throw new HTTPException(403, { message: "Нет доступа" });
  }
  const deleted = await deleteUserById(prisma, id);
  return c.json({ message: "Пользователь удален", deleted }, 200);
});

export default userRouter;
