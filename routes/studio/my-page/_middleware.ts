import { MiddlewareHandler } from "$fresh/server.ts";
import { memberGuard } from "@/middlewares/auth.ts";

export const handler: MiddlewareHandler[] = [
  memberGuard,
];
