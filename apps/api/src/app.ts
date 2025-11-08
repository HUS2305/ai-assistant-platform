import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "./router";

export const buildApp = () => {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "test"
  });

  app.register(cors, {
    origin: (origin, cb) => {
      cb(null, true);
    }
  });

  app.register(rateLimit, {
    max: 200,
    timeWindow: "1 minute"
  });

  app.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: appRouter, createContext: () => ({}) }
  });

  app.get("/health", async () => ({ status: "ok" }));

  return app;
};

