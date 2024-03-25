import Link from "next/link";
import { SearchInput } from "@/components/search-bar";
import ConnectWalletButton from "@/components/rainbow-button";

export const metadata = {
  openGraph: {
    title: "Matters Forum",
    url: "https://matters-forum.vercel.app",
    siteName: "Matters Forum",
  },
};

export default function HNLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col text-[15px] leading-[18px] md:px-20 md:py-2">
      <header className="flex items-center justify-between gap-2 bg-green-700 px-1 py-2 pr-2 text-sm md:py-1">
        <div className="flex items-center">
          <Link prefetch={true} href="/">
            <span className="mr-2 flex h-6 w-6 flex-shrink-0 items-center justify-center border border-white p-1 text-white">
              <span>M</span>
            </span>
          </Link>
          <div className="flex flex-col items-start md:flex-row md:items-center">
            <Link prefetch={true} href="/" className="mr-3">
              <h1 className="whitespace-nowrap text-base font-bold leading-tight">
                Matters Forum
              </h1>
            </Link>
            <nav>
              <ul className="inline-flex flex-wrap leading-tight tracking-tight">
                <li>
                  <Link
                    prefetch={true}
                    className="hover:underline"
                    href="/newest"
                  >
                    newest
                  </Link>
                </li>
                <li className="px-1">|</li>
                <li>
                  <Link
                    prefetch={true}
                    className="hover:underline"
                    href="/trend"
                  >
                    trend
                  </Link>
                </li>
                <li className="px-1">|</li>
                <li>
                  <Link
                    prefetch={true}
                    className="hover:underline"
                    href="/priciest"
                  >
                    priciest
                  </Link>
                </li>
                <li className="px-1">|</li>
                <li>
                  <Link prefetch={true} className="hover:underline" href="/rss">
                    rss
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="flex min-w-[30%] flex-col items-end md:min-w-[inherit] md:flex-row md:items-center">
          <ConnectWalletButton label="Connect" />
        </div>
      </header>

      <main className="flex-grow bg-[#f6f6ef] px-1 py-4 md:px-2">
        {children}
      </main>

      <footer
        className="flex flex-col items-center justify-center border-t-2 border-green-700 bg-[#f6f6ef]
              p-4 text-black"
      >
        <nav>
          <ul className="flex flex-wrap justify-center gap-1 text-sm md:gap-2">
            <li>
              <span className="cursor-default">Guidelines</span>
            </li>
            <li aria-hidden="true">|</li>
            <li>
              <span className="cursor-default">FAQ</span>
            </li>
            <li>
              <span className="cursor-default">Legal</span>
            </li>
            <li aria-hidden="true">|</li>
            <li>
              <span className="cursor-default">Contact</span>
            </li>
          </ul>
        </nav>
        <div className="mx-auto mt-2 w-full max-w-md ">
          <form>
            <div className="relative flex justify-center">
              <SearchInput />
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
