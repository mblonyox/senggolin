import { Handlers, PageProps } from "$fresh/server.ts";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

export const handler: Handlers = {
  GET: (req, ctx) => {
    return ctx.render();
  },
  POST: (req, ctx) => {
    return ctx.render();
  },
};

export default function ResetPasswordPage({ url }: PageProps) {
  return (
    <MainLayout>
      <SeoTags url={url} />
      <form method="post">
        <fieldset>
          <legend>Reset Password</legend>
          <label htmlFor="email-input">
            <span>Email :</span>
          </label>
          <input type="email" name="email" id="email-input" />
          <button type="submit">Send Link</button>
        </fieldset>
        <p>
          Retry using password: <a href={`${new URL("login", url)}`}>Login</a>
        </p>
      </form>
    </MainLayout>
  );
}
