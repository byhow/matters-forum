// src/app/api/rss/route.ts
import { db, CurationSchema } from "@/lib/db";
import { curations } from "@/lib/db";
import { convertIPFStoHTTPS } from "@/lib/ipfs";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await db
    .select()
    .from(curations)
    .orderBy(desc(curations.blockNumber));

  const xml = generateRSS(posts);

  const response = new Response(xml, {
    status: 200,
    statusText: "ok",
  });

  response.headers.append("content-type", "text/xml");

  return response;
}

function generateRSS(curations: CurationSchema[]) {
  const site_url = process.env.NEXT_PUBLIC_BASE_URL;
  if (!site_url) {
    throw new Error(`RSS base url not found`);
  }
  const feedOptions = {
    title: "Matters RSS Feed",
    description: "The RSS feed for all Curation @ Matters",
    site_url,
    feed_url: `${site_url}/rss.xml`,
    image_url: `${site_url}/favico.ico`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}`,
  };

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${feedOptions.title}</title>
      <description>${feedOptions.description}</description>
      <link>${feedOptions.feed_url}</link>
      <lastBuildDate>${feedOptions.pubDate}</lastBuildDate>`;

  curations.forEach(({ blockNumber, uri, createdAt, amount }) => {
    rss += `
        <item>
        <title>${String(blockNumber)}</title>
        <description>price amount is ${String(amount)}</description>
        <link>${convertIPFStoHTTPS(uri || "")}</link>
        <pubDate>${createdAt}</pubDate>
      </item>;
    `;
  });
  rss += `
      </channel>
    </rss>`;
  return rss;
}
