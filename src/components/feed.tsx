import { db } from "@/lib/db";
import { curations } from "@/lib/db";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import MoreLink from "./more-link";
import { convertIPFStoHTTPS } from "@/lib/ipfs";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { TimeAgo } from "./time-ago";

const PER_PAGE = 30;

export async function getFeed({
  isNewest,
  page,
  type,
  limit = PER_PAGE,
}: {
  isNewest: boolean;
  page: number;
  type: string | null;
  limit?: number;
}) {
  return db
    .select()
    .from(curations)
    .orderBy(desc(curations.blockNumber))
    .limit(PER_PAGE)
    .offset((page - 1) * limit);
}

type Props = {
  page?: number;
  isNewest?: boolean;
  type?: string | null;
  q?: string | null;
};

export async function Feed({
  page = 1,
  isNewest = false,
  type = null,
  q = null,
}: Props) {
  const uid = headers().get("x-vercel-id") ?? nanoid();
  console.time(`fetch stories ${uid}`);
  const feed = await getFeed({ page, isNewest, type });
  console.timeEnd(`fetch stories ${uid}`);

  return feed.length ? (
    <div>
      <ul className="space-y-2 list-disc">
        {feed.map(async (post, n) => {
          if (!post.uri) {
            return null;
          }
          // const meta = await getArticleMetadata(convertIPFStoHTTPS(post.uri));
          return (
            <li key={post.id} className="flex gap-2">
              <span className="align-top text-[#666] md:text-[#828282] text-right flex-shrink-0 min-w-6 md:min-w-5">
                {n + (page - 1) * PER_PAGE + 1}.
              </span>
              <div>
                <a
                  className="text-[#000000] hover:underline"
                  rel="nofollow noreferrer"
                  target="_blank"
                  href={convertIPFStoHTTPS(post.uri)}
                >
                  {post.txHash} - {post.blockNumber}
                </a>
                <span className="text-xs ml-1 text-[#666] md:text-[#828282]">
                  (ipfs.io)
                </span>
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
                  <span
                    className="cursor-default"
                    aria-hidden="true"
                    title="Not implemented"
                  >
                    hide
                  </span>{" "}
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
      <div className="mt-4 ml-7">
        <Suspense fallback={null}>
          <More page={page} isNewest={isNewest} type={type} q={q} />
        </Suspense>
      </div>
    </div>
  ) : (
    <div>No feed at the moment.</div>
  );
}

async function hasMoreFeed({
  isNewest,
  type,
  page,
  q,
}: {
  isNewest: boolean;
  page: number;
  type: string | null;
  q: string | null;
}) {
  const count = await db
    .select({ id: curations.id })
    .from(curations)
    .limit(PER_PAGE)
    .offset(page * PER_PAGE);
  return count.length > 0;
}

async function More({
  isNewest,
  type,
  page,
  q,
}: {
  isNewest: boolean;
  page: number;
  type: string | null;
  q: string | null;
}) {
  const hasMore = await hasMoreFeed({
    isNewest,
    type,
    page,
    q,
  });

  return hasMore ? <MoreLink q={q} page={page + 1} /> : null;
}
