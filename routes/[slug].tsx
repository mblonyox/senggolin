import { Handler, PageProps } from "$fresh/server.ts";
import { ContextState, SupabaseClient } from "@/utils/context_state.types.ts";
import SeoTags from "@/components/seo_tags.tsx";

type Data = {
  page: NonNullable<Awaited<ReturnType<typeof getPage>>>;
  links: NonNullable<Awaited<ReturnType<typeof getLinks>>>;
};

const getPage = async (client: SupabaseClient, slug: string) => {
  const { data, error } = await client.from("page").select(
    "id, title, description",
  ).eq("slug", slug);
  if (error) throw new Error(error.message);
  return data.at(0);
};

const getLinks = async (client: SupabaseClient, pageId: number) => {
  const { data, error } = await client.from("link").select(
    "id, icon_url, text, url",
  )
    .eq(
      "page_id",
      pageId,
    );
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const handler: Handler<Data, ContextState> = async (req, ctx) => {
  const client = ctx.state.supabaseClient!;
  const slug = ctx.params.slug;
  const page = await getPage(client, slug);
  if (!page) return ctx.renderNotFound();
  const links = await getLinks(client, page.id);
  return ctx.render({ page, links });
};

export default function Greet({ data, url }: PageProps<Data>) {
  return (
    <>
      <SeoTags
        title={data.page.title}
        description={data.page.description}
        url={url}
      />
      <main>
        <hgroup>
          <h1>{data.page.title}</h1>
          <p>{data.page.description}</p>
        </hgroup>
        <hr />
        {data.links.map((link) => (
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            <div>
              <img src={link.icon_url} alt={link.text} />
              <span>{link.text}</span>
            </div>
          </a>
        ))}
      </main>
    </>
  );
}
