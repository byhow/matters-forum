import { db } from "@/lib/db";
import { curations } from "@/lib/db/schema";
import { convertIPFStoHTTPS } from "@/lib/ipfs";
import { NextResponse } from "next/server";
import RSS from 'rss'

export async function GET(req: Request, res: NextResponse) {
  // const site_url = process.env.NEXT_BASE_URL!;

  // const feedOptions = {
  //   title: "Matters RSS Feed",
  //   description: "The RSS feed for all Curation @ Matters",
  //   site_url,
  //   feed_url: `${site_url}/rss.xml`,
  //   image_url: `${site_url}/favico.ico`,
  //   pubDate: new Date(),
  //   copyright: `All rights reserved ${new Date().getFullYear()}`
  // }

  // const feed = new RSS(feedOptions);

  // (await db.select().from(curations)).map(({ blockNumber, uri, createdAt, amount }) => {
  //   feed.item({
  //     title: String(blockNumber),
  //     url: convertIPFStoHTTPS(uri || ""),
  //     date: createdAt,
  //     description: `price amount is ${String(amount)}`
  //   })
  // })

  // return new Response(feed.xml({ indent: true }), {
  //   headers: {
  //     'Content-Type': 'application/xml; charset=utf-8',
  //   },
  // })
}