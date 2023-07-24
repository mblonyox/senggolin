import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { useSignal } from "@preact/signals";
import Form from "../components/form.tsx";
import LinksTable from "../islands/links-table.tsx";
import { getLinksBySessionId, insertLink } from "../utils/kv.ts";
import { isValidUrl, onlyAlphaNumeric } from "../utils/validations.ts";
import { firstMessages, required, validate } from "validasaur";

type Link = {
  path: string;
  url: string;
  createdAt: Date;
  clicks: number;
};

type Data = {
  form: {
    url?: string;
    path?: string;
    errors?: {
      url?: string;
      path?: string;
    };
  };
  links: Link[];
};

export const handler: Handlers<Data> = {
  GET: async (_req, ctx) => {
    const sessionId = ctx.state.sessionId as string;
    const links = await getLinksBySessionId(sessionId);
    return ctx.render({
      form: {
        url: "",
        path: "",
      },
      links,
    });
  },
  POST: async (req, ctx) => {
    const sessionId = ctx.state.sessionId as string;
    const links = await getLinksBySessionId(sessionId);
    const formData = await req.formData();
    const data: Data = {
      form: {
        url: formData.get("url")?.toString(),
        path: formData.get("path")?.toString(),
      },
      links,
    };
    const [passes, errors] = await validate(data.form, {
      url: [required, isValidUrl],
      path: [required, onlyAlphaNumeric],
    }, {
      messages: {
        "url.required": "URL wajib diisi.",
        "url.isValidUrl": "URL tidak valid.",
        "path.onlyAlphaNumeric":
          "Path hanya menggunakan huruf,angka dan dash (-).",
      },
    });
    if (!passes) {
      data.form.errors = firstMessages(errors);
      return ctx.render(data);
    }
    const link = {
      url: data.form.url!,
      path: data.form.path!,
      sessionId,
      createdAt: new Date(),
      clicks: 0,
    };
    await insertLink(link);
    links.push(link);
    data.form.url = "";
    data.form.path = "";
    return ctx.render(data, {
      status: 201,
      headers: { "Content-Location": `/${link.path}` },
    });
  },
};

export default function Home({ data: { form, links } }: PageProps<Data>) {
  const linksSignal = useSignal(links);
  return (
    <>
      <Head>
        <title>Senggol.in</title>
      </Head>
      <Form {...form} />
      <hr />
      <LinksTable links={linksSignal} />
    </>
  );
}
