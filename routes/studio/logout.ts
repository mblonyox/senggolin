import { Handler } from "$fresh/server.ts";
import { SupabaseClient } from "@supabase/supabase-js";

export const handler: Handler<never, { supabaseClient?: SupabaseClient }> =
  async (
    req,
    ctx,
  ) => {
    const { error } = await ctx.state.supabaseClient?.auth.signOut() ?? {};
    if (error) throw new Error(error.message);
    return Response.redirect(new URL("/", req.url), 302);
  };
