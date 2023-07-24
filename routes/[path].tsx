import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { deleteLink, getLinkByPath, linkClicks } from "../utils/kv.ts";

type Data = {
  url: string;
};

export const handler: Handlers<Data> = {
  GET: async (_req, ctx) => {
    const path = ctx.params.path;
    const link = await getLinkByPath(path);
    if (link === null) return ctx.renderNotFound();
    await linkClicks(link);
    return ctx.render({ url: link.url }, {
      status: 301,
      headers: { "Location": link.url },
    });
  },
  DELETE: async (_req, ctx) => {
    const path = ctx.params.path;
    const link = await getLinkByPath(path);
    if (link === null) return ctx.renderNotFound();
    const sessionId = ctx.state.sessionId as string;
    if (link.sessionId !== sessionId) {
      return new Response(null, { status: 403 });
    }
    await deleteLink(link);
    return new Response(null, { status: 204 });
  },
};

export default function Path({ data: { url } }: PageProps<Data>) {
  return (
    <>
      <Head>
        <meta httpEquiv="Refresh" content={`0; URL=${url}`} />
        <script
          dangerouslySetInnerHTML={{ __html: `window.location = "${url}";` }}
        />
      </Head>
      <p>Anda akan diteruskan ke alamat selanjutnya...</p>
    </>
  );
}
