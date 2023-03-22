import { Handler } from "$fresh/server.ts";
import { ContextState } from "@/utils/context_state.types.ts";

export const handler: Handler<never, ContextState> = (req, ctx) => {
  if (ctx.state.user) {
    return Response.redirect(new URL(req.url + "/my-page"), 302);
  }
  return Response.redirect(new URL(req.url + "/login"), 302);
};
