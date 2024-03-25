import { indexExampleFilteredLogs } from "@/lib/optimism";
import { withAxiom, AxiomRequest } from "next-axiom";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req: AxiomRequest) => {
  req.log.info(`${req.url} running cron...`);
  try {
    await indexExampleFilteredLogs();
  } catch {
    return Response.json(
      { message: "failed to periodically insert example logs" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "success" }, { status: 200 });
});
