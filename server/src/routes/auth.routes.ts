import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validators/user.validator.js";
import { registerUser, loginUser } from "../services/user/auth.service.js";
import { checkUserAdmin } from "../utils/checkAdmin.js";
import type { ContextWithPrisma } from "../types/index.js";
import { jwt } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

const authRouter = new Hono<ContextWithPrisma>();

authRouter.post(
  "/register",
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

authRouter.post("/login", zValidator("json", userLoginSchema), async (c) => {
  const prisma = c.get("prisma");
  const data = c.req.valid("json");
  const token = await loginUser(prisma, data.login, data.password);
  return c.json({ message: "Успешная аутентификация", token }, 200);
});

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new HTTPException(500, { message: "Ошибка сервера" });
}

authRouter.use("/register/admin", jwt({ secret: secret, alg: "HS256" }));
authRouter.post(
  "/register/admin",
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

export default authRouter;
