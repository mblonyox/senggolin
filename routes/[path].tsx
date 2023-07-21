import { Handler, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getLinkByPath, linkClicks } from "../utils/kv.ts";

type Data = {
  url: string;
};

export const handler: Handler<Data> = async (_req, ctx) => {
  console.log(ctx.params);
  const path = ctx.params.path;
  const link = await getLinkByPath(path);
  if (link === null) return ctx.renderNotFound();
  await linkClicks(link);
  return ctx.render({ url: link.url }, {
    status: 301,
    headers: { "Location": link.url },
  });
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
