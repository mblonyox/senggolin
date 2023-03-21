import { Handler } from "$fresh/server.ts";
import { User } from "@supabase/supabase-js";

export const handler: Handler<never, { user?: User }> = (req, ctx) => {
  if (ctx.state.user) {
    return Response.redirect(new URL(req.url + "/member"), 302);
  }
  return Response.redirect(new URL(req.url + "/login"), 302);
};
