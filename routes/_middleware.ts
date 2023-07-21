import { MiddlewareHandler, MiddlewareHandlerContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

export const handler: MiddlewareHandler[] = [
  async function setSessionId(req: Request, ctx: MiddlewareHandlerContext) {
    const cookies = getCookies(req.headers);
    const sessionId = cookies["sessionId"] ?? crypto.randomUUID();
    ctx.state.sessionId = sessionId;
    const resp = await ctx.next();
    setCookie(resp.headers, {
      name: "sessionId",
      value: sessionId,
      path: "/",
      httpOnly: true,
      maxAge: 31536000,
    });
    return resp;
  },
];
