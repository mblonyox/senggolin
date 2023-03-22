import { Handlers, PageProps } from "$fresh/server.ts";
import { ContextState } from "@/utils/context_state.types.ts";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

type Data = {
  error?: string;
  slug: string;
  title: string;
  description: string;
};

const validateData = (
  { slug, title, description }: Data,
): string | undefined => {
  if (!slug.length) return "Slug can't be empty.";
  if (/[^A-Za-z0-9-]/.test(slug)) {
    return "Slug can only alphanumeric and dash (-).";
  }
  if (title.length <= 5) return "Title should be 5 characters or longer.";
  if (description.split(/\s+/).length < 5) {
    return "Description should be longer than 5 words.";
  }
};

export const handler: Handlers<Data, ContextState> = {
  GET: (req, ctx) => {
    return ctx.render({ slug: "", title: "", description: "" });
  },
  POST: async (req, ctx) => {
    const user_id = ctx.state.user!.id;
    const formData = await req.formData();
    const slug = formData.get("slug")?.toString().trim() ?? "";
    const title = formData.get("title")?.toString().trim() ?? "";
    const description = formData.get("description")?.toString().trim() ?? "";
    const data: Data = { slug, title, description };
    data.error = validateData(data);
    if (data.error) {
      const { body, headers } = await ctx.render(data);
      return new Response(body, { headers, status: 400 });
    }
    const pageResponse = await ctx.state.supabaseClient!.from("page").insert({
      ...data,
      user_id,
    }).select();
    const newPage = pageResponse.data?.at(0);
    if (newPage) {
      return Response.redirect(new URL(`${newPage.id}`, req.url), 303);
    }
    if (pageResponse.error) data.error = pageResponse.error.message;
    else data.error = "Unknown error.";
    const { body, headers } = await ctx.render(data);
    return new Response(body, { headers, status: 500 });
  },
};

export default function NewPage({ data, url }: PageProps<Data>) {
  return (
    <MainLayout>
      <SeoTags
        title="Create a new Page"
        description="Create a new page."
        url={url}
      />
      <form method="post">
        <fieldset>
          <legend>Create a new Page</legend>
          {!!data.error && <blockquote>{data.error}</blockquote>}
          <p>
            <label htmlFor="slug">Slug / Path :</label>
            <input type="text" name="slug" id="slug" defaultValue={data.slug} />
          </p>
          <p>
            <label htmlFor="title">Title :</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={data.title}
            />
          </p>
          <p>
            <label htmlFor="description">Description :</label>
            <textarea
              name="description"
              id="description"
              cols={30}
              rows={5}
              defaultValue={data.description}
            >
            </textarea>
          </p>
          <button type="submit">Create</button>
        </fieldset>
      </form>
    </MainLayout>
  );
}
