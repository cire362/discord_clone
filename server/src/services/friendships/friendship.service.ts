import { HTTPException } from "hono/http-exception";
import { PrismaClient } from "../../generated/prisma/client.js";
import { checkError } from "../../utils/checkError.js";
import { safeUserSelect } from "../shared/user.select.js";

export async function sendFriendRequest(
  prisma: PrismaClient,
  sender_id: number,
  receiver_id: number,
) {
  try {
    if (sender_id === receiver_id) {
      throw new HTTPException(409, {
        message: "Заявка не может быть отправлена самому себе",
      });
    }

    const alreadyExists = await prisma.friendship.findFirst({
      where: {
        OR: [
          { sender_id, receiver_id },
          { receiver_id: sender_id, sender_id: receiver_id },
        ],
      },
    });

    if (alreadyExists) {
      throw new HTTPException(409, { message: "Заявка уже отправлена" });
    }

    const friendship = await prisma.friendship.create({
      data: {
        sender_id,
        receiver_id,
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
        receiver_id,
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
