import { z } from "zod";

export const userRegisterSchema = z.object({
  login: z.string().min(3),
  nickname: z.string().min(3),
  password: z.string().min(6),
});

export const userLoginSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(6),
});

export const userEditSchema = z.object({
  login: z.string().min(3).optional(),
  nickname: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  status: z.string().min(1).optional(),
  avatar_url: z.string().optional(),
});

export const userMessageSchema = z.object({
  text: z.string().min(1),
});
