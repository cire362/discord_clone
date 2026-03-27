import { Hono } from "hono";
import { jwt } from "hono/jwt";
import type { ContextWithPrisma } from "../types/index.js";

import authRouter from "./auth.routes.js";
import usersRouter from "./users.routes.js";
import categoriesRouter from "./categories.routes.js";
import friendsRouter from "./friends.routes.js";
import messagesRouter from "./messages.routes.js";

const apiRouter = new Hono<ContextWithPrisma>();

apiRouter.route("/users", authRouter);

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

apiRouter.use("/users/*", jwt({ secret, alg: "HS256" }));

apiRouter.route("/users/categories", categoriesRouter);
apiRouter.route("/users/friends", friendsRouter);
apiRouter.route("/users", messagesRouter);
apiRouter.route("/users", usersRouter);

export default apiRouter;
