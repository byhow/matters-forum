import { db } from "@/lib/db";
import { curations } from "@/lib/db/schema";
import { getArticleMetadata } from "@/lib/gpt";
import { desc } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";

const PER_PAGE = 30;

export async function getFeed() {
  return db
    .select()
    .from(curations)
    .orderBy(desc(curations.createdAt))
    .limit(PER_PAGE);
}

function convertIPFStoHTTPS(ipfsUrl: string) {
  // Define the IPFS base URL for the conversion
  const baseURL = "https://ipfs.io/ipfs/";
  // Replace the IPFS protocol prefix with the base HTTP URL
  const httpsUrl = ipfsUrl.replace("ipfs://", baseURL);

  return httpsUrl;
}

export async function Feed() {
  const feed = await getFeed();

  return feed.length ? (
    <div>
      <ul className="space-y-2 list-disc">
        {feed.map(async (post) => {
          if (!post.uri) {
            return null;
          }
          // const meta = await getArticleMetadata(convertIPFStoHTTPS(post.uri));
          return (
            <li key={post.id} className="flex gap-2">
              {convertIPFStoHTTPS(post.uri)}
              {/* {<pre>{JSON.stringify(meta, null, 2)}</pre>} */}
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <div>No feed at the moment.</div>
  );
}
