import { Handlers, PageProps } from "$fresh/server.ts";
import { ContextState, SupabaseClient } from "@/utils/context_state.types.ts";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

type Data = {
  errorMessage?: string;
  page: NonNullable<Awaited<ReturnType<typeof getPage>>>;
  links: NonNullable<Awaited<ReturnType<typeof getLinks>>>;
};

const getPage = async (
  client: SupabaseClient,
  pageId: string,
  userId: string,
) => {
  const { data, error } = await client.from("page").select(
    "id, title, description",
  )
    .eq("id", pageId).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data?.at(0);
};

const getLinks = async (client: SupabaseClient, pageId: string) => {
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

const isValidURL = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (_) {
    return false;
  }
};

const validateLink = (
  link: { icon_url: string; url: string; text: string },
) => {
  if (!link.icon_url || !link.icon_url.trim()) {
    throw new Error("icon_url can't be empty.");
  }
  if (!isValidURL(link.icon_url)) throw new Error("icon_url is not valid URL.");
  if (!link.url || !link.url.trim()) throw new Error("url can't be empty.");
  if (!isValidURL(link.url)) throw new Error("url is not valid URL.");
  if (!link.text || !link.text.trim()) throw new Error("text can't be empty.");
};

const createLink = async (
  client: SupabaseClient,
  link: { icon_url: string; url: string; text: string; page_id: number },
) => {
  const { error } = await client.from("link").insert(link);
  if (error) throw new Error(error.message);
};

const updateLink = async (
  client: SupabaseClient,
  linkId: number,
  link: { icon_url?: string; url?: string; text?: string },
) => {
  const { error } = await client.from("link").update(link).eq("id", linkId);
  if (error) throw new Error(error.message);
};

const deleteLink = async (
  client: SupabaseClient,
  linkId: number,
) => {
  const { error } = await client.from("link").delete().eq("id", linkId);
  if (error) throw new Error(error.message);
};

export const handler: Handlers<Data, ContextState> = {
  GET: async (_req, ctx) => {
    const userId = ctx.state.user!.id;
    const client = ctx.state.supabaseClient!;
    const pageId = ctx.params.pageId;
    const page = await getPage(client, pageId, userId);
    if (!page) return ctx.renderNotFound();
    const links = await getLinks(client, pageId);
    const data: Data = {
      page,
      links,
    };
    return ctx.render(data);
  },
  POST: async (req, ctx) => {
    const userId = ctx.state.user!.id;
    const client = ctx.state.supabaseClient!;
    const pageId = ctx.params.pageId;
    const page = await getPage(client, pageId, userId);
    if (!page) return ctx.renderNotFound();
    const formData = await req.formData();
    const action = formData.get("action")?.toString();
    const id = parseInt(formData.get("id")?.toString() ?? "");
    let errorMessage: string | undefined;
    try {
      if (action === "delete") deleteLink(client, id);
      const icon_url = formData.get("icon_url")?.toString() ?? "";
      const url = formData.get("url")?.toString() ?? "";
      const text = formData.get("text")?.toString() ?? "";
      validateLink({ icon_url, url, text });
      if (action === "update") {
        updateLink(client, id, { icon_url, url, text });
      }
      if (action === "create") {
        createLink(client, {
          icon_url,
          url,
          text,
          page_id: parseInt(pageId),
        });
      }
    } catch (error) {
      errorMessage = error.message;
    }
    const links = await getLinks(client, pageId);
    const data: Data = {
      page,
      links,
      errorMessage,
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
      {!!data.errorMessage && <blockquote>{data.errorMessage}</blockquote>}
      {data.links.map((link) => (
        <form method="post" style={{ display: "flex", gap: "1rem" }}>
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
      <form method="post" style={{ display: "flex", gap: "1rem" }}>
        <input
          type="text"
          name="icon_url"
          placeholder="icon_url"
          id="new-link-icon-url"
        />
        <input
          type="text"
          name="text"
          placeholder="text"
          id="new-link-text"
        />
        <input
          type="text"
          name="url"
          placeholder="url"
          id="new-link-url"
        />
        <button type="submit" name="action" value="create">Create</button>
      </form>
    </MainLayout>
  );
}
