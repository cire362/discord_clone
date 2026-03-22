import { z } from "zod";

export const userRegisterSchema = z.object({
  login: z.string(),
  nickname: z.string(),
  password: z.string(),
  user_category_id: z.number().default(1),
});

export const userLoginSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export const userEditSchema = z.object({
  login: z.string().optional(),
  nickname: z.string().optional(),
  password: z.string().optional(),
  status: z.string().optional(),
  avatar_url: z.string().optional(),
});
