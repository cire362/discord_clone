import { HTTPException } from "hono/http-exception";
import type {
  UserUncheckedCreateInput,
  UserUncheckedUpdateInput,
} from "../generated/prisma/models.js";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";
import { checkError } from "../utils/checkError.js";
import { sign } from "hono/jwt";

export async function registerUser(
  prisma: PrismaClient,
  user: UserUncheckedCreateInput,
) {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const new_user = await prisma.user.create({
      data: { ...user, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = new_user;

    return userWithoutPassword;
  } catch (e) {
    checkError(e, {
      P2002: { status: 409, message: "Пользователь уже существует" },
    });
  }
}

export async function loginUser(
  prisma: PrismaClient,
  login: string,
  password: string,
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        login,
      },
    });

    if (!user) {
      throw new HTTPException(404, { message: "Пользователь не существует" });
    }

    const isPasswordSuccessful = await bcrypt.compare(password, user.password);

    if (!isPasswordSuccessful) {
      throw new HTTPException(403, {
        message: "Неверное имя пользователя или пароль",
      });
    }

    const payload = {
      id: user.id,
      user_category: user.user_category_id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new HTTPException(500, { message: "Ошибка сервера" });
    }

    const token = await sign(payload, secret);

    return token;
  } catch (e) {
    checkError(e, {});
  }
}

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
      data: data,
      select: {
        id: true,
        login: true,
        nickname: true,
        status: true,
        avatar_url: true,
      },
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
      select: {
        id: true,
        login: true,
        nickname: true,
        status: true,
        avatar_url: true,
      },
    });

    if (users.length == 0) {
      throw new HTTPException(404, { message: "Пользователи не найдены" });
    }

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
      select: {
        id: true,
        login: true,
        nickname: true,
        status: true,
        avatar_url: true,
      },
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
      select: {
        id: true,
        login: true,
        nickname: true,
        status: true,
        avatar_url: true,
      },
    });

    return deleted;
  } catch (e) {
    checkError(e, {
      P2025: { status: 404, message: "Пользователь не найден" },
    });
  }
}
