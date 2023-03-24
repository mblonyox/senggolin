import { MiddlewareHandler } from "$fresh/server.ts";
import { setSupabaseClient } from "@/middlewares/supabase.ts";

export const handler: MiddlewareHandler[] = [
  setSupabaseClient,
];
