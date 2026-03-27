import { HTTPException } from "hono/http-exception";
import { PrismaClient } from "../../generated/prisma/client.js";
import type {
  User_CategoriesCreateInput,
  User_CategoriesUpdateInput,
} from "../../generated/prisma/models.js";
import { checkError } from "../../utils/checkError.js";

export async function createUserCategory(
  prisma: PrismaClient,
  category: User_CategoriesCreateInput,
) {
  try {
    const new_category = await prisma.user_Categories.create({
      data: category,
    });

    return new_category;
  } catch (e) {
    checkError(e, {
      P2002: { status: 409, message: "Категория уже существует" },
    });
  }
}

export async function updateUserCategory(
  prisma: PrismaClient,
  data: User_CategoriesUpdateInput,
  id: number,
) {
  try {
    const update = await prisma.user_Categories.update({
      where: {
        id,
      },
      data: data,
    });

    return update;
  } catch (e) {
    checkError(e, {
      P2025: { status: 404, message: "Категория не найдена" },
      P2002: { status: 409, message: "Категория уже существует" },
    });
  }
}

export async function getUserCategories(prisma: PrismaClient) {
  try {
    const categories = await prisma.user_Categories.findMany();

    return categories;
  } catch (e) {
    checkError(e, {});
  }
}

export async function getUserCategoryById(prisma: PrismaClient, id: number) {
  try {
    const category = await prisma.user_Categories.findFirst({
      where: {
        id,
      },
    });

    if (!category) {
      throw new HTTPException(404, { message: "Категория не найдена" });
    }

    return category;
  } catch (e) {
    checkError(e, {});
  }
}

export async function deleteUserCategoryById(prisma: PrismaClient, id: number) {
  try {
    const deleted = await prisma.user_Categories.delete({
      where: {
        id,
      },
    });

    return deleted;
  } catch (e) {
    checkError(e, {
      P2025: { status: 404, message: "Категория не найдена" },
    });
  }
}
