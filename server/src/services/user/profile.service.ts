import { HTTPException } from "hono/http-exception";
import type { UserUncheckedUpdateInput } from "../../generated/prisma/models.js";
import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcrypt";
import { checkError } from "../../utils/checkError.js";
import { safeUserSelect } from "../shared/user.select.js";

export async function updateProfile(
  prisma: PrismaClient,
  id: number,
  data: UserUncheckedUpdateInput,
) {
  try {
    if (data.password && typeof data.password === "string") {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data = { ...data, password: hashedPassword };
    }

    const update = await prisma.user.update({
      where: {
        id,
      },
      data,
      select: safeUserSelect,
    });

    return update;
  } catch (e) {
    checkError(e, {
      P2025: { status: 404, message: "Пользователь не найден" },
      P2002: { status: 409, message: "Логин уже существует" },
    });
  }
}

export async function getUsers(prisma: PrismaClient) {
  try {
    const users = await prisma.user.findMany({
      select: safeUserSelect,
    });

    return users;
  } catch (e) {
    checkError(e, {});
  }
}

export async function searchUsers(
  prisma: PrismaClient,
  query: string,
  currentUserId: number,
) {
  try {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      throw new HTTPException(400, { message: "Введите минимум 2 символа" });
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        OR: [
          {
            login: {
              contains: trimmed,
              mode: "insensitive",
            },
          },
          {
            nickname: {
              contains: trimmed,
              mode: "insensitive",
            },
          },
        ],
      },
      select: safeUserSelect,
      take: 20,
      orderBy: {
        id: "asc",
      },
    });

    return users;
  } catch (e) {
    checkError(e, {});
  }
}

export async function getUserById(prisma: PrismaClient, id: number) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: safeUserSelect,
    });

    if (!user) {
      throw new HTTPException(404, { message: "Пользователь не найден" });
    }

    return user;
  } catch (e) {
    checkError(e, {});
  }
}

export async function deleteUserById(prisma: PrismaClient, id: number) {
  try {
    const deleted = await prisma.user.delete({
      where: {
        id,
      },
      select: safeUserSelect,
    });

    return deleted;
  } catch (e) {
    checkError(e, {
      P2025: { status: 404, message: "Пользователь не найден" },
    });
  }
}
