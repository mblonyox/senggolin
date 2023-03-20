import { MiddlewareHandler } from "$fresh/server.ts";
import { setSupabaseClient } from "@/middlewares/supabase.ts";
import { setUser } from "@/middlewares/auth.ts";

export const handler: MiddlewareHandler[] = [
  setSupabaseClient,
  setUser,
];
