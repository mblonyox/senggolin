import { Handlers, PageProps } from "$fresh/server.ts";
import { SupabaseClient, User } from "@supabase/supabase-js";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

type Data = {
  error?: string;
  email: string;
  password: string;
  remember: boolean;
};

export const handler: Handlers<
  Data,
  { supabaseClient?: SupabaseClient; user?: User }
> = {
  GET: (req, ctx) => {
    if (ctx.state.user) {
      return Response.redirect(new URL("member", req.url), 302);
    }
    return ctx.render({ email: "", password: "", remember: false });
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const remember = !!formData.get("remember");
    const authResponse = await ctx.state.supabaseClient?.auth
      .signInWithPassword(
        { email, password },
      );
    if (authResponse?.data.user) {
      return Response.redirect(new URL("member", req.url), 302);
    }
    const error = authResponse?.error?.message;
    const renderred = await ctx.render({ email, password, remember, error });
    return new Response(renderred.body, {
      headers: renderred.headers,
      status: 401,
    });
  },
};

export default function LoginPage({ data, url }: PageProps<Data>) {
  return (
    <MainLayout>
      <SeoTags url={url} />
      <form method="post">
        <fieldset>
          <legend>Login</legend>
          <blockquote>{data.error}</blockquote>
          <p>
            <label htmlFor="email">
              <span>Email :</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={data.email}
            />
          </p>
          <p>
            <label htmlFor="password">
              <span>Password :</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={data.password}
            />
          </p>
          <p>
            <label htmlFor="remember-me">
              <input
                type="checkbox"
                name="remember"
                id="remember-me"
                defaultChecked={data.remember}
              />
              <span>Remember me</span>
            </label>
          </p>
          <button type="submit">Login</button>
        </fieldset>
        <p>
          Forget password?{" "}
          <a href={`${new URL("reset-password", url)}`}>
            Reset Password
          </a>
        </p>
        <p>
          Don't have account?{" "}
          <a href={`${new URL("register", url)}`}>Register</a>
        </p>
      </form>
    </MainLayout>
  );
}
