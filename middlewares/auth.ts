import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { SupabaseClient, User } from "@supabase/supabase-js";

export async function setUser(
  _req: Request,
  ctx: MiddlewareHandlerContext<
    { supabaseClient?: SupabaseClient; user?: User }
  >,
) {
  const sessionResponse = await ctx.state.supabaseClient?.auth.getSession();
  const user = sessionResponse?.data.session?.user;
  if (user) ctx.state.user = user;
  return ctx.next();
}

export function memberGuard(
  _req: Request,
  ctx: MiddlewareHandlerContext<
    { user?: User }
  >,
) {
  console.log({ ctx });
  if (ctx.state.user?.role !== "authenticated") {
    return new Response("Unauthorized access.", {
      status: 401,
    });
  }
  return ctx.next();
}

export function adminGuard(
  _req: Request,
  ctx: MiddlewareHandlerContext<
    { user?: User }
  >,
) {
  if (ctx.state.user?.role !== "admin") {
    return new Response("Forbidden access.", {
      status: 403,
    });
  }
  return ctx.next();
}
