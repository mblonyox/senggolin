import { Cookie, getCookies, setCookie } from "$std/http/cookie.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createServerSupabaseClient } from "@supabase/auth-helpers-shared";
import { ContextState } from "@/utils/context_state.types.ts";

export async function setSupabaseClient(
  req: Request,
  ctx: MiddlewareHandlerContext<ContextState>,
) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_KEY");
  if (!supabaseUrl || !supabaseKey) {
    return new Response("Environment variable not set.", { status: 500 });
  }
  const requestCookies = getCookies(req.headers);
  const responseCookies = [] as Cookie[];
  const supabaseClient = createServerSupabaseClient({
    supabaseUrl,
    supabaseKey,
    getCookie(name) {
      const cookie = requestCookies[name];
      return cookie && decodeURIComponent(cookie);
    },
    setCookie(name, value, options) {
      responseCookies.push({
        name,
        value: encodeURIComponent(value),
        ...options,
      });
    },
    getRequestHeader(name) {
      return req.headers.get(name) ?? undefined;
    },
  });
  ctx.state.supabaseClient = supabaseClient;
  const response = await ctx.next();
  const headers = new Headers(response.headers);
  for (const cookie of responseCookies) {
    setCookie(headers, cookie);
  }
  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
