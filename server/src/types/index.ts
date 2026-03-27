import { PrismaClient } from "../generated/prisma/client.js";

export type JwtPayload = {
  id: number;
  user_category: number;
  exp: number;
};

export type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
    jwtPayload: JwtPayload;
  };
};
