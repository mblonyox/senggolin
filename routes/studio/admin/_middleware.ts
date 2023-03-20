import { MiddlewareHandler } from "$fresh/server.ts";
import { adminGuard } from "@/middlewares/auth.ts";

export const handler: MiddlewareHandler[] = [
  adminGuard,
];
