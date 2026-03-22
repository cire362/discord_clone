import { HTTPException } from "hono/http-exception";
import { Prisma } from "../generated/prisma/client.js";
import type { ContentfulStatusCode } from "hono/utils/http-status";
export function checkError(
  e: any,
  customMessages: Record<
    string,
    { status: ContentfulStatusCode; message: string }
  >,
) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    const message = customMessages[e.code];

    if (message) {
      throw new HTTPException(message.status, { message: message.message });
    } else {
      throw new HTTPException(500, { message: "Ошибка сервера" });
    }
  }
  throw e;
}
