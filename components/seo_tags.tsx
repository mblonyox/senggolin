import { Head } from "$fresh/runtime.ts";
import { META_DESCRIPTION, META_IMAGE, META_TITLE } from "@/utils/env.ts";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  url: string | URL;
};

export default function SeoTags(props: Props) {
  const title = props.title ?? META_TITLE;
  const description = props.description ?? META_DESCRIPTION;
  const image = props.image ?? META_IMAGE;
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={props.url.toString()} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={props.url.toString()} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Head>
  );
}
