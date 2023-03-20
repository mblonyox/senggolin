import { ComponentChildren } from "preact";
import { META_TITLE } from "@/utils/env.ts";

type Props = {
  children: ComponentChildren;
};

export default function MainLayout({ children }: Props) {
  return (
    <>
      <header>
        <h1>
          <a href="/">{META_TITLE}</a>
        </h1>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/studio">Studio Panel</a>
            </li>
          </ul>
        </nav>
        <hr />
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>{META_TITLE} &copy; {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
