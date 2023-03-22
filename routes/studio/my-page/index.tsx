import { Handler, PageProps } from "$fresh/server.ts";
import { ContextState } from "@/utils/context_state.types.ts";
import MainLayout from "@/components/main_layout.tsx";
import SeoTags from "@/components/seo_tags.tsx";

type Page = { id: number; slug: string; title: string; count: number };
type Data = {
  pages: Page[];
};

export const handler: Handler<Data, ContextState> = async (req, ctx) => {
  const userId = ctx.state.user!.id;
  const pagesResponse = await ctx.state.supabaseClient!.from("page_views")
    .select().eq("user_id", userId);
  const pages = (pagesResponse.data ?? []) as Page[];
  return ctx.render({ pages });
};

export default function MyPageIndexPage({ url, data }: PageProps<Data>) {
  return (
    <MainLayout>
      <SeoTags
        title="My Page"
        description="Manage your created page."
        url={url}
      />
      <h2>My Pages</h2>
      <p>
        <a href={url + "/new"}>Create new page</a>
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Slug</th>
            <th scope="col">Title</th>
            <th scope="col">Views</th>
          </tr>
        </thead>
        <tbody>
          {data.pages.map((page) => (
            <tr>
              <th scope="row">{page.id}</th>
              <td>{page.slug}</td>
              <td>{page.title}</td>
              <td>{page.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}
