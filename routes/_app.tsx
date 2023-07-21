import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"
        />
      </Head>
      <header style={{ padding: 0 }}>
        <div className="container">
          <nav>
            <ul>
              <li>
                <strong>
                  Senggol.in
                </strong>
              </li>
            </ul>
            <ul>
              <li>
                <a href="http://pub.senggol.in">
                  <img
                    src="/icons/mastodon.svg"
                    alt="Senggol.in Mastodon"
                    width={32}
                    height={32}
                  />
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <hr />
      </header>
      <main>
        <div className="container">
          <Component />
        </div>
      </main>
      <footer>
        <hr />
        <div className="container">
          Created by @mblonyox
        </div>
      </footer>
    </>
  );
}
