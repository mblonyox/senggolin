import { MiddlewareHandler } from "$fresh/server.ts";
import { setUser } from "@/middlewares/auth.ts";

export const handler: MiddlewareHandler[] = [
  setUser,
];
