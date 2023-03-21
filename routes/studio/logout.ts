import { Handler } from "$fresh/server.ts";
import { ContextState } from "@/utils/context_state.types.ts";

export const handler: Handler<never, ContextState> = async (
  req,
  ctx,
) => {
  const { error } = await ctx.state.supabaseClient?.auth.signOut() ?? {};
  if (error) throw new Error(error.message);
  return Response.redirect(new URL("/", req.url), 302);
};
