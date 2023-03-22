import { Handlers, PageProps } from "$fresh/server.ts";
import { ContextState, SupabaseClient } from "@/utils/context_state.types.ts";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

type Data = {
  error?: string;
  page: NonNullable<Awaited<ReturnType<typeof getPage>>>;
  links: NonNullable<Awaited<ReturnType<typeof getLinks>>>;
};

const getPage = async (
  client: SupabaseClient,
  pageId: string,
  userId: string,
) => {
  const pageResponse = await client.from("page").select(
    "id, title, description",
  )
    .eq("id", pageId).eq("user_id", userId);
  return pageResponse.data?.at(0);
};

const getLinks = async (client: SupabaseClient, pageId: string) => {
  const linksResponse = await client.from("link").select(
    "id, icon_url, text, url",
  )
    .eq(
      "page_id",
      pageId,
    );
  return linksResponse.data;
};

export const handler: Handlers<Data, ContextState> = {
  GET: async (req, ctx) => {
    const userId = ctx.state.user!.id;
    const client = ctx.state.supabaseClient!;
    const pageId = ctx.params.pageId;
    const page = await getPage(client, pageId, userId);
    if (!page) return ctx.renderNotFound();
    const links = await getLinks(client, pageId) ??
      [];
    const data: Data = {
      page,
      links,
    };
    return ctx.render(data);
  },
};

export default function EditPage({ data, url }: PageProps<Data>) {
  return (
    <MainLayout>
      <SeoTags url={url} />
      <h2>{data.page.title}</h2>
      <p>{data.page.description}</p>
      <hr />
      {data.links.map((link) => (
        <form method="post">
          <input type="hidden" name="id" value={link.id} />
          <input
            type="text"
            name="icon_url"
            id={`link-${link.id}-icon-url`}
            defaultValue={link.icon_url}
          />
          <input
            type="text"
            name="text"
            id={`link-${link.id}-text`}
            defaultValue={link.text}
          />
          <input
            type="text"
            name="url"
            id={`link-${link.id}-url`}
            defaultValue={link.url}
          />
          <button type="submit" name="action" value="update">Update</button>
          <button type="submit" name="action" value="delete">Delete</button>
        </form>
      ))}
      <form method="post">
        <input
          type="text"
          name="icon_url"
          id="new-link-icon-url"
        />
        <input
          type="text"
          name="text"
          id="new-link-text"
        />
        <input
          type="text"
          name="url"
          id="new-link-url"
        />
        <button type="submit" name="action" value="create">Create</button>
      </form>
    </MainLayout>
  );
}
