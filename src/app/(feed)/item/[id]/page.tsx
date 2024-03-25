import { db, curations } from "@/lib/db";
import { TimeAgo } from "@/components/time-ago";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { Comments } from "@/components/comments";
import { ReplyForm } from "./reply-form";
import Link from "next/link";
import ArticleTitle from "@/components/article-title";
import { convertIPFStoHTTPS } from "@/lib/ipfs";

export const metadata = {
  openGraph: {
    title: "Matters Forum",
    url: "https://matters-forum.vercel.app",
    siteName: "Matters Forum",
  },
};

const getFeed = async function (idParam: string) {
  const id = `curation_${idParam}`;
  return (
    await db
      .select({
        id: curations.id,
        url: curations.uri,
        created_at: curations.createdAt,
        comment_count: curations.commentCount,
        tx_hash: curations.txHash,
      })
      .from(curations)
      .where(eq(curations.id, id))
      .limit(1)
  )[0];
};

export default async function ItemPage({
  params: { id: idParam },
}: {
  params: { id: string };
}) {
  const rid = headers().get("x-vercel-id") ?? nanoid();

  console.time(`fetch story ${idParam} (req: ${rid})`);
  const feed = await getFeed(idParam);
  console.timeEnd(`fetch story ${idParam} (req: ${rid})`);

  if (!feed) {
    notFound();
  }

  const now = Date.now();

  return (
    <div className="px-3">
      <div className="mb-4 flex items-start">
        <div className="flex flex-col items-center mr-1 gap-y-1">
          <svg
            height="12"
            viewBox="0 0 32 16"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m2 27 14-29 14 29z" fill="#999" />
          </svg>
        </div>
        <div>
          {feed.url ? (
            <div className="flex flex-row">
              <a
                className="text-[#000000] hover:underline"
                rel={"nofollow noreferrer"}
                target={"_blank"}
                href={feed.url}
              >
                <Suspense fallback={`Loading title...`}>
                  <ArticleTitle
                    ipfsURL={convertIPFStoHTTPS(feed.url)}
                    txHash={feed.tx_hash}
                  />
                </Suspense>
              </a>
              <span className="text-xs ml-1 text-[#666] md:text-[#828282]">
                (ipfs.io)
              </span>
            </div>
          ) : (
            <Link
              prefetch={true}
              href={`/item/${feed.id.replace(/^curation_/, "")}`}
              className="text-[#000000] hover:underline"
            >
              {feed.id}
            </Link>
          )}
          <p className="text-xs text-[#666] md:text-[#828282]">
            <TimeAgo now={now} date={feed.created_at} />{" "}
            <span aria-hidden={true}>| </span>
            <Link
              prefetch={true}
              className="hover:underline"
              href={`/item/${feed.id.replace(/^curation_/, "")}`}
            >
              {feed.comment_count} comments
            </Link>
          </p>
          <div className="my-4 max-w-2xl space-y-3">
            <ReplyForm curationId={feed.id} />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <Comments curationId={feed.id} />
      </Suspense>
    </div>
  );
}
