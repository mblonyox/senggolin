import { Handlers, PageProps } from "$fresh/server.ts";
import { SupabaseClient, User } from "@supabase/supabase-js";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

type Data = {
  error?: string;
  sent?: boolean;
  email: string;
};

export const handler: Handlers<
  Data,
  { supabaseClient?: SupabaseClient; user?: User }
> = {
  GET: (req, ctx) => {
    if (ctx.state.user) {
      return Response.redirect(new URL("member", req.url), 302);
    }
    return ctx.render({ email: "" });
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();
    const email = formData.get("email")?.toString() ?? "";
    const { error } =
      await ctx.state.supabaseClient?.auth.resetPasswordForEmail(email) ?? {};
    return ctx.render({ error: error?.message, sent: error === null, email });
  },
};

export default function ResetPasswordPage({ data, url }: PageProps<Data>) {
  return (
    <MainLayout>
      <SeoTags url={url} />
      {data.sent
        ? (
          <article>
            <h2>Reset password.</h2>
            <p>
              Email for reset password link was sent to{" "}
              <strong>{data.email}</strong>.
            </p>
          </article>
        )
        : (
          <form method="post">
            <fieldset>
              <legend>Reset Password</legend>
              {!!data.error && <blockquote>{data.error}</blockquote>}
              <label htmlFor="email-input">
                <span>Email :</span>
              </label>
              <input
                type="email"
                name="email"
                id="email-input"
                defaultValue={data.email}
              />
              <button type="submit">Send Link</button>
            </fieldset>
            <p>
              Retry using password:{" "}
              <a href={`${new URL("login", url)}`}>Login</a>
            </p>
          </form>
        )}
    </MainLayout>
  );
}
