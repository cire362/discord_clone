import { PrismaClient } from "../generated/prisma/client.js";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  userEditSchema,
  userLoginSchema,
  userMessageSchema,
  userRegisterSchema,
} from "../validators/user.validator.js";
import {
  deleteUserById,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  searchUsers,
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
import {
  acceptFriendRequest,
  getAllFriendships,
  getConversations,
  getMessages,
  sendFriendRequest,
  sendMessage,
  getDMMessages,
} from "../services/friend.service.js";

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

userRouter.use("/users/*", jwt({ secret: secret, alg: "HS256" }));

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

userRouter.get("/users/search", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const query = c.req.query("q") || "";
  const users = await searchUsers(prisma, query, payload.id);
  return c.json({ message: "Пользователи найдены", users }, 200);
});

userRouter.get("/users/friends", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const friends = await getAllFriendships(prisma, payload.id);
  return c.json({ message: "Друзья получены", friends }, 200);
});

userRouter.get("/users/conversations", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const conversations = await getConversations(prisma, payload.id);
  return c.json({ message: "Диалоги получены", conversations }, 200);
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

userRouter.post("/users/friends/:id", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const id = parseInt(c.req.param("id"));
  const friendRequest = await sendFriendRequest(prisma, payload.id, id);
  return c.json({ message: "Заявка отправлена", friendRequest }, 201);
});

userRouter.put("/users/friends/accept/:requestId", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const id = parseInt(c.req.param("requestId"));
  const acceptRequest = await acceptFriendRequest(prisma, id, payload.id);
  return c.json({ message: "Заявка принята", acceptRequest }, 200);
});

userRouter.get("/users/conversations/:conversationId/messages", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const conversationId = parseInt(c.req.param("conversationId"));
  const messages = await getMessages(prisma, conversationId, payload.id);
  return c.json({ messages: "Сообщения получены", received: messages }, 200);
});

userRouter.post(
  "/users/dm/:userId/messages",
  zValidator("json", userMessageSchema),
  async (c) => {
    const prisma = c.get("prisma");
    const receiverId = parseInt(c.req.param("userId"));
    const text = c.req.valid("json");
    const payload = c.get("jwtPayload");
    const newMessage = await sendMessage(
      prisma,
      payload.id,
      receiverId,
      text.text,
    );

    return c.json({ message: "Сообщение отправлено", newMessage }, 201);
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

userRouter.get(
  "/users/dm/:userId/messages",
  async (c) => {
    const prisma = c.get("prisma");
    const receiverId = parseInt(c.req.param("userId"));
    const payload = c.get("jwtPayload");
    const messages = await getDMMessages(prisma, payload.id, receiverId);
    return c.json({ messages: "Сообщения получены", received: messages }, 200);
  },
);

export default userRouter;
