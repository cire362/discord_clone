import { HTTPException } from "hono/http-exception";

export const checkUserAdmin = (id: number, allowedRoles: number[]) => {
  if (!allowedRoles.includes(id)) {
    throw new HTTPException(403, { message: "Доступ запрещен" });
  } else true;
};
