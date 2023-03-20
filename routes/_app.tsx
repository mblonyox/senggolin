import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/awsm.css/dist/awsm.min.css"
        />
      </Head>
      <Component />
    </>
  );
}
