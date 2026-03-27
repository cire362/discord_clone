import { HTTPException } from "hono/http-exception";
import { PrismaClient } from "../../generated/prisma/client.js";
import { checkError } from "../../utils/checkError.js";
import { safeUserSelect } from "../shared/user.select.js";
import { createDmPairKey } from "../shared/dm.helpers.js";

export async function sendMessage(
  prisma: PrismaClient,
  sender_id: number,
  receiver_id: number,
  text: string,
) {
  try {
    if (sender_id === receiver_id) {
      throw new HTTPException(409, {
        message: "Нельзя отправить сообщение самому себе",
      });
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiver_id,
      },
      select: {
        id: true,
      },
    });

    if (!receiver) {
      throw new HTTPException(404, { message: "Пользователь не найден" });
    }

    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!friendship) {
      throw new HTTPException(403, {
        message:
          "Нельзя отправлять сообщения пользователю, который не в друзьях",
      });
    }

    const pairKey = createDmPairKey(sender_id, receiver_id);

    const conversation = await prisma.conversation.upsert({
      where: {
        pair_key: pairKey,
      },
      update: {},
      create: {
        pair_key: pairKey,
        users: {
          connect: [{ id: sender_id }, { id: receiver_id }],
        },
      },
      select: {
        id: true,
      },
    });

    const newMessage = await prisma.message.create({
      data: {
        text,
        sender_id,
        conversation_id: conversation.id,
        timestamp: new Date(),
      },
    });

    return newMessage;
  } catch (e) {
    checkError(e, {});
  }
}

export async function getMessages(
  prisma: PrismaClient,
  conversation_id: number,
  user_id: number,
) {
  try {
    const isParticipant = await prisma.conversation.findFirst({
      where: {
        id: conversation_id,
        users: {
          some: {
            id: user_id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!isParticipant) {
      throw new HTTPException(403, { message: "Нет доступа к диалогу" });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversation_id,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return messages;
  } catch (e) {
    checkError(e, {});
  }
}

export async function getConversations(prisma: PrismaClient, user_id: number) {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
          some: {
            id: user_id,
          },
        },
      },
      include: {
        users: {
          select: safeUserSelect,
        },
      },
    });

    return conversations;
  } catch (e) {
    checkError(e, {});
  }
}

export async function getDMMessages(
  prisma: PrismaClient,
  sender_id: number,
  receiver_id: number,
) {
  try {
    const pairKey = createDmPairKey(sender_id, receiver_id);
    const conversation = await prisma.conversation.findUnique({
      where: {
        pair_key: pairKey,
      },
      select: {
        id: true,
      },
    });

    if (!conversation) {
      return [];
    }

    const messages = await prisma.message.findMany({
      where: {
        conversation_id: conversation.id,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return messages;
  } catch (e) {
    checkError(e, {});
  }
}
