import { db } from "@/lib/db";
import { curations } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import MoreLink from "./more-link";
// import { convertIPFStoHTTPS } from "@/lib/ipfs";

const PER_PAGE = 30;

export function convertIPFStoHTTPS(ipfsUrl: string) {
  // Define the IPFS base URL for the conversion
  const baseURL = "https://ipfs.io/ipfs/";
  // const pinataURL = "https://gateway.pinata.cloud/ipfs/";
  // Replace the IPFS protocol prefix with the base HTTP URL
  const httpsUrl = ipfsUrl.replace("ipfs://", baseURL);
  return httpsUrl;
}
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
  const feed = await getFeed({ page, isNewest, type });
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
              <Link
                className="underline"
                rel="noopener noreferrer"
                target="_blank"
                href={convertIPFStoHTTPS(post.uri)}
              >
                {post.blockNumber} - {convertIPFStoHTTPS(post.uri)}
              </Link>
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
