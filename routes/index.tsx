import { PageProps } from "$fresh/server.ts";
import SeoTags from "@/components/seo_tags.tsx";
import MainLayout from "@/components/main_layout.tsx";
import { META_DESCRIPTION } from "@/utils/env.ts";

export default function Home({ url }: PageProps) {
  return (
    <MainLayout>
      <SeoTags url={url} />
      <img
        src="/logo.webp"
        alt="senggol.in logo"
        width={128}
        height={128}
      />
      <p>
        {META_DESCRIPTION}
      </p>
    </MainLayout>
  );
}
