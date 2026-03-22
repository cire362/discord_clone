import { HTTPException } from "hono/http-exception";
import { PrismaClient } from "../generated/prisma/client.js";
import { checkError } from "../utils/checkError.js";

export async function sendFriendRequest(
  prisma: PrismaClient,
  sender_id: number,
  receiver_id: number,
) {
  try {
    if (sender_id == receiver_id) {
      throw new HTTPException(409, {
        message: "Заявка не может быть отправлена самому себе",
      });
    }

    const alreadyExists = await prisma.friendship.findFirst({
      where: {
        OR: [
          { sender_id: sender_id, receiver_id: receiver_id },
          { receiver_id: sender_id, sender_id: receiver_id },
        ],
      },
    });

    if (alreadyExists) {
      throw new HTTPException(409, { message: "Заявка уже отправлена" });
    }

    const friendship = await prisma.friendship.create({
      data: {
        sender_id: sender_id,
        receiver_id: receiver_id,
      },
    });

    return friendship;
  } catch (e) {
    checkError(e, {
      P2002: { status: 409, message: "Заявка в друзья уже существует" },
    });
  }
}

export async function acceptFriendRequest(
  prisma: PrismaClient,
  friendRequestId: number,
  receiver_id: number,
) {
  try {
    const request = await prisma.friendship.findFirst({
      where: {
        id: friendRequestId,
        status: "PENDING",
        receiver_id: receiver_id,
      },
    });

    if (!request) {
      throw new HTTPException(404, { message: "Заявка не найдена" });
    }

    const updated = await prisma.friendship.update({
      where: {
        id: friendRequestId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    return updated;
  } catch (e) {
    checkError(e, {});
  }
}

export async function getAllFriendships(prisma: PrismaClient, user_id: number) {
  try {
    const friendship = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ receiver_id: user_id }, { sender_id: user_id }],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (friendship.length == 0) {
      throw new HTTPException(404, { message: "Друзья не нейдены" });
    }

    const friends = friendship.map((f) => {
      return f.sender_id === user_id ? f.receiver : f.sender;
    });

    return friends;
  } catch (e) {
    checkError(e, {});
  }
}

export async function sendMessage(
  prisma: PrismaClient,
  sender_id: number,
  receiver_id: number,
  text: string,
) {
  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                id: sender_id,
              },
            },
          },
          {
            users: {
              some: {
                id: receiver_id,
              },
            },
          },
        ],
      },
    });

    let conversationId = conversation?.id;

    if (!conversation) {
      const newConversation = await prisma.conversation.create({
        data: {
          users: {
            connect: [{ id: sender_id }, { id: receiver_id }],
          },
        },
      });

      conversationId = newConversation.id;
    }

    const newMessage = await prisma.message.create({
      data: {
        text: text,
        sender_id: sender_id,
        conversation_id: conversationId,
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
) {
  try {
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
