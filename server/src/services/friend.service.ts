import { HTTPException } from "hono/http-exception";
import { PrismaClient } from "../generated/prisma/client.js";
import { checkError } from "../utils/checkError.js";

const safeUserSelect = {
  id: true,
  login: true,
  nickname: true,
  status: true,
  avatar_url: true,
};

function createDmPairKey(firstUserId: number, secondUserId: number) {
  const left = Math.min(firstUserId, secondUserId);
  const right = Math.max(firstUserId, secondUserId);

  return `${left}:${right}`;
}

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
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ receiver_id: user_id }, { sender_id: user_id }],
      },
      include: {
        sender: {
          select: safeUserSelect,
        },
        receiver: {
          select: safeUserSelect,
        },
      },
    });

    const incoming = friendships.filter((f) => f.receiver_id === user_id);
    const outgoing = friendships.filter((f) => f.sender_id === user_id);

    return { incoming, outgoing };
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
          { sender_id: sender_id, receiver_id: receiver_id },
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
        text: text,
        sender_id: sender_id,
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

    if (conversations.length == 0) {
      throw new HTTPException(404, { message: "Диалоги не найдены" });
    }

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
      }
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
