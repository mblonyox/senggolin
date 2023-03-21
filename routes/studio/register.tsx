import { Handlers, PageProps } from "$fresh/server.ts";
import { SupabaseClient, User } from "@supabase/supabase-js";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

type Data = {
  error?: string;
  confirmation_sent_at?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const handler: Handlers<
  Data,
  { supabaseClient?: SupabaseClient; user?: User }
> = {
  GET: (req, ctx) => {
    if (ctx.state.user) {
      return Response.redirect(new URL("member", req.url), 302);
    }
    return ctx.render({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  },
  POST: async (req, ctx) => {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";
    const data: Data = { name, email, password, confirmPassword };
    if (password === confirmPassword) {
      const authResponse = await ctx.state.supabaseClient?.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (authResponse?.data.user) {
        return ctx.render({
          ...data,
          confirmation_sent_at: authResponse.data.user.confirmation_sent_at,
        });
      }
      data.error = authResponse?.error?.message;
    } else {
      data.error = "Confirmation Password is not matched.";
    }
    const renderred = await ctx.render(data);
    return new Response(renderred.body, {
      headers: renderred.headers,
      status: 400,
    });
  },
};

export default function RegisterPage({ data, url }: PageProps<Data>) {
  return (
    <MainLayout>
      <SeoTags url={url} />
      {data.confirmation_sent_at
        ? (
          <article>
            <h2>Registrattion success</h2>
            <p>
              Email for confirmation was sent to <strong>{data.email}</strong>
              {" "}
              at <em>{new Date(data.confirmation_sent_at).toISOString()}</em>.
            </p>
          </article>
        )
        : (
          <form method="post">
            <fieldset>
              <legend>Register</legend>
              {!!data.error && <blockquote>{data.error}</blockquote>}
              <p>
                <label htmlFor="name">
                  <span>
                    Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  defaultValue={data.name}
                />
              </p>
              <p>
                <label htmlFor="email">
                  <span>
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  defaultValue={data.email}
                />
              </p>
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
              <button type="submit">Register</button>
            </fieldset>
            <p>
              Already have an account?{" "}
              <a href={`${new URL("login", url)}`}>Login</a>
            </p>
          </form>
        )}
    </MainLayout>
  );
}
