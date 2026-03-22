import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import type { PrismaClient } from "./generated/prisma/client.js";
import withPrisma from "./lib/prisma.js";
import userRouter from "./routes/user.routes.js";
import { HTTPException } from "hono/http-exception";

type ContextWithPrisma = {
  Variables: {
    prisma: PrismaClient;
  };
};

const app = new Hono<ContextWithPrisma>();
app.use("*", withPrisma);
app.onError((err: any, c: Context) => {
  if (err instanceof HTTPException) {
    return c.json({ err: err.message }, err.status);
  } else {
    return c.json({ message: err.message }, 500);
  }
});
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", userRouter);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
