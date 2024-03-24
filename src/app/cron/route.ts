import { indexExampleFilteredLogs } from "@/lib/optimism";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.debug(`${req.url} running cron...`)
  try {
    await indexExampleFilteredLogs()
  } catch {
    return Response.json({ message: "failed to periodically insert example logs" }, { status: 500 })
  }

  return Response.json({ message: "success" }, { status: 200 });
}