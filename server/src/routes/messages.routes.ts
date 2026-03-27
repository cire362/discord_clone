import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { userMessageSchema } from "../validators/user.validator.js";
import {
  getConversations,
  getMessages,
  sendMessage,
  getDMMessages,
} from "../services/messages/dm.service.js";
import type { ContextWithPrisma } from "../types/index.js";

const messagesRouter = new Hono<ContextWithPrisma>();

messagesRouter.get("/conversations", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const conversations = await getConversations(prisma, payload.id);
  return c.json({ message: "Диалоги получены", conversations }, 200);
});

messagesRouter.get("/conversations/:conversationId/messages", async (c) => {
  const prisma = c.get("prisma");
  const payload = c.get("jwtPayload");
  const conversationId = parseInt(c.req.param("conversationId"));
  const messages = await getMessages(prisma, conversationId, payload.id);
  return c.json({ messages: "Сообщения получены", received: messages }, 200);
});

messagesRouter.post(
  "/dm/:userId/messages",
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

messagesRouter.get("/dm/:userId/messages", async (c) => {
  const prisma = c.get("prisma");
  const receiverId = parseInt(c.req.param("userId"));
  const payload = c.get("jwtPayload");
  const messages = await getDMMessages(prisma, payload.id, receiverId);
  return c.json({ messages: "Сообщения получены", received: messages }, 200);
});

export default messagesRouter;
