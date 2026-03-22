import { z } from "zod";

export const user_categoriesCreateSchema = z.object({
  name: z.string(),
});
