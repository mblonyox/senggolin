import { PageProps } from "$fresh/server.ts";
import SeoTags from "@/components/seo_tags.tsx";
import { META_DESCRIPTION } from "@/utils/env.ts";

export default function Home({ url }: PageProps) {
  return (
    <>
      <SeoTags url={url} />
      <div class="w-full max-w-screen-md mx-auto py-16">
        <img
          src="/logo.webp"
          class="w-32 h-32 mx-auto"
          alt="senggol.in logo"
        />
        <p class="my-8 w-1/2 mx-auto text-center">
          {META_DESCRIPTION}
        </p>
      </div>
    </>
  );
}
