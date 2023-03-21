import { Handlers, PageProps } from "$fresh/server.ts";
import { SupabaseClient, User } from "@supabase/supabase-js";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

type Data = {
  error?: string;
  changed?: boolean;
  password: string;
  confirmPassword: string;
};

export const handler: Handlers<
  Data,
  { supabaseClient?: SupabaseClient; user?: User }
> = {
  GET: async (req, ctx) => {
    const searchParams = new URL(req.url).searchParams;
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    if (!email || !token) {
      return Response.redirect(new URL("login", req.url), 302);
    }
    const authResponse = await ctx.state.supabaseClient?.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });
    if (!authResponse?.data.user) {
      return Response.redirect(new URL("reset-password", req.url), 302);
    }
    return ctx.render({ password: "", confirmPassword: "" });
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";
    const data: Data = { password, confirmPassword };
    if (password === confirmPassword) {
      const userResponse = await ctx.state.supabaseClient?.auth.updateUser({
        password,
      });
      if (userResponse?.error) {
        data.error = userResponse.error.message;
      } else {
        data.changed = true;
      }
    } else {
      data.error = "Confirmation Password is not matched.";
    }
    return ctx.render(data);
  },
};

export default function ChangePasswordPage({ data, url }: PageProps<Data>) {
  return (
    <MainLayout>
      <SeoTags url={url} />
      {data.changed
        ? (
          <article>
            <h2>Password changed.</h2>
            <p>
              Password successfully changed. Try login with the new password.
            </p>
            <p>
              <a href={`${new URL("login", url)}`}>Login</a>
            </p>
          </article>
        )
        : (
          <form method="post">
            <fieldset>
              <legend>Change Password</legend>
              {!!data.error && <blockquote>{data.error}</blockquote>}
              <p>
                <label htmlFor="password">
                  <span>
                    New Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  defaultValue={data.password}
                />
              </p>
              <p>
                <label htmlFor="confirm-password">
                  <span>Confirm Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirm-password"
                  autoComplete="new-password"
                  defaultValue={data.confirmPassword}
                />
              </p>
              <button type="submit">Change</button>
            </fieldset>
          </form>
        )}
    </MainLayout>
  );
}
