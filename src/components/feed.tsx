import { db } from "@/lib/db";
import { curations } from "@/lib/db";
import { desc, sql } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import MoreLink from "./more-link";
import { convertIPFStoHTTPS } from "@/lib/ipfs";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { TimeAgo } from "./time-ago";
import ArticleTitle from "./article-title";
import { formatGwei } from "viem";

const PER_PAGE = 15;

export async function getFeed({
  isNewest,
  isTrend,
  isPriciest,
  page,
  type,
  limit = PER_PAGE,
}: {
  isNewest: boolean;
  isTrend: boolean;
  isPriciest: boolean;
  page: number;
  type: string | null;
  limit?: number;
}) {
  return db
    .select()
    .from(curations)
    .orderBy(
      isPriciest ? desc(curations.amount) : sql`1=1`,
      isTrend ? desc(curations.commentCount) : sql`1=1`,
      isNewest ? desc(curations.createdAt) : desc(curations.blockNumber)
    )
    .limit(PER_PAGE)
    .offset((page - 1) * limit);
}

type Props = {
  page?: number;
  isNewest?: boolean;
  isTrend?: boolean;
  isPriciest?: boolean;
  type?: string | null;
  q?: string | null;
};

export async function Feed({
  page = 1,
  isNewest = false,
  isPriciest = false,
  isTrend = false,
  type = null,
  q = null,
}: Props) {
  const uid = headers().get("x-vercel-id") ?? nanoid();
  console.time(`fetch stories ${uid}`);
  const feed = await getFeed({ page, isNewest, isPriciest, isTrend, type });
  console.timeEnd(`fetch stories ${uid}`);

  return feed.length ? (
    <div>
      <ul className="list-disc space-y-2">
        {feed.map(async (post, n) => {
          if (!post.uri) {
            return null;
          }
          return (
            <li key={post.id} className="flex gap-2">
              <span className="min-w-6 flex-shrink-0 text-right align-top text-[#666] md:min-w-5 md:text-[#828282]">
                {n + (page - 1) * PER_PAGE + 1}.
              </span>
              <div>
                <div className="flex flex-row">
                  <a
                    className="text-[#000000] hover:underline"
                    rel="nofollow noreferrer"
                    target="_blank"
                    href={convertIPFStoHTTPS(post.uri)}
                  >
                    <Suspense
                      fallback={`Loading ${post.txHash} at ${post.blockNumber}...`}
                    >
                      <ArticleTitle
                        ipfsURL={convertIPFStoHTTPS(post.uri)}
                        txHash={post.txHash}
                      />
                    </Suspense>
                  </a>
                  <span className="ml-1 text-xs text-[#666] md:text-[#828282]">
                    (ipfs.io)
                  </span>
                </div>
                <p className="text-xs text-[#666] md:text-[#828282]">
                  <TimeAgo now={Date.now()} date={post.createdAt} /> |{" "}
                  <span
                    className="cursor-default"
                    aria-hidden="true"
                    title="Not implemented"
                  >
                    tag
                  </span>{" "}
                  |{" "}
                  {!!post.amount && (
                    <span
                      className="cursor-default"
                      aria-hidden="true"
                      title="Price"
                    >
                      {formatGwei(post.amount)} ETH
                    </span>
                  )}{" "}
                  |{" "}
                  <Link
                    prefetch={true}
                    className="hover:underline"
                    href={`/item/${post.id.replace(/^curation_/, "")}`}
                  >
                    {post.commentCount} comments
                  </Link>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="ml-7 mt-4">
        <Suspense fallback={null}>
          <More
            page={page}
            isNewest={isNewest}
            isPriciest={isPriciest}
            isTrend={isTrend}
            type={type}
            q={q}
          />
        </Suspense>
      </div>
    </div>
  ) : (
    <div>No feed at the moment.</div>
  );
}

async function hasMoreFeed({
  isNewest,
  isTrend,
  isPriciest,
  type,
  page,
  q,
}: {
  isNewest: boolean;
  isTrend: boolean;
  isPriciest: boolean;
  page: number;
  type: string | null;
  q: string | null;
}) {
  const count = await db
    .select({ id: curations.id })
    .from(curations)
    .orderBy(
      isNewest ? desc(curations.createdAt) : desc(curations.blockNumber),
      isTrend ? desc(curations.commentCount) : sql`1=1`,
      isPriciest ? desc(curations.amount) : sql`1=1`
    )
    .limit(PER_PAGE)
    .offset(page * PER_PAGE);

  return count.length > 0;
}

async function More({
  isNewest,
  isTrend,
  isPriciest,
  type,
  page,
  q,
}: {
  isNewest: boolean;
  isPriciest: boolean;
  isTrend: boolean;
  page: number;
  type: string | null;
  q: string | null;
}) {
  const hasMore = await hasMoreFeed({
    isNewest,
    isTrend,
    isPriciest,
    type,
    page,
    q,
  });

  if (hasMore) {
    return <MoreLink q={q} page={page + 1} />;
  } else {
    return null;
  }
}
