import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import withPrisma from "./lib/prisma.js";
import apiRouter from "./routes/index.js";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import type { ContextWithPrisma } from "./types/index.js";

const app = new Hono<ContextWithPrisma>();
app.use("*", withPrisma).use(cors());
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

app.route("/", apiRouter);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
