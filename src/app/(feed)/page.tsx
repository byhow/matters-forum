import { db, genCurationId } from "@/lib/db";
import { CURATION_ABI } from "@/lib/abi";
import { publicOptimismClient } from "@/lib/optimism";
import { curations, dump } from "@/lib/db";
import { type Hex, decodeEventLog } from "viem";
import { Feed } from "@/components/feed";
import z from "zod";
import { headers as dynamic } from "next/headers";

const SearchParamsSchema = z.object({
  p: z.coerce.number().min(1).max(100).optional().default(1),
  newest: z.enum(["", "1"]).optional(),
  trend: z.enum(["", "1"]).optional(),
  type: z.enum(["ask", "show", "jobs", "story"]).optional().default("story"),
});

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  dynamic();

  const query = SearchParamsSchema.safeParse(searchParams);

  if (!query.success) {
    return <p>Bad Request</p>;
  }

  const isNewest = query.data.newest === "1";
  const isTrend = query.data.trend === "1";
  const type = query.data.type;
  const page = query.data.p;

  publicOptimismClient.watchContractEvent({
    address: "0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8",
    abi: CURATION_ABI,
    eventName: "Curation",
    onLogs: (logs) => {
      const decodedLogs = logs.map((log) => {
        const decoded = decodeEventLog({
          abi: CURATION_ABI,
          data: log.data,
          topics: log.topics as [signature: `0x${string}`, ...hex: Hex[]],
        });

        if ("curator" in decoded.args) {
          db.insert(curations)
            .values({
              id: genCurationId(),
              txHash: log.transactionHash,
              blockNumber: Number(log.blockNumber),
              toAddress: log.address,
              uri: decoded.args.uri,
              amount: decoded.args.amount,
              tokenAddress: decoded.args.token,
            })
            .onConflictDoNothing({
              target: curations.txHash,
            });
        }
        return decoded;
      });

      db.insert(dump).values({
        eventDump: JSON.stringify({
          original: logs,
          updated: decodedLogs,
        }),
      });
    },
  });

  return (
    <div>
      <Feed page={page} isNewest={isNewest} isTrend={isTrend} type={type} />
    </div>
  );
}
