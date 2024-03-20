import { db } from "@/lib/db";
import { curationAbi } from "@/lib/abi";
import { publicOptimismClient } from "@/lib/optimism";
import { curations, dump } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { getAbiItem, parseAbiItem, type Hex, decodeEventLog } from "viem";

export default async function Home() {
  const logs = await publicOptimismClient.getLogs({
    address: "0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8",
    fromBlock: BigInt(117622710),
    toBlock: BigInt(117638279),
  });

  const dec = logs.map((l) => {
    decodeEventLog({
      abi: curationAbi,
      eventName: "Curation",
      data: l.data,
      topics: l.topics,
      strict: false,
    });
  });

  publicOptimismClient.watchContractEvent({
    address: "0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8",
    abi: curationAbi,
    eventName: "Curation",
    onLogs: (logs) => {
      const decodedLogs = logs.map((log) => {
        return decodeEventLog({
          abi: curationAbi,
          data: log.data,
          topics: log.topics as [signature: `0x${string}`, ...hex: Hex[]],
        });
      });

      db.insert(dump).values({
        eventDump: JSON.stringify({
          original: logs,
          updated: decodedLogs,
        }),
      });
    },
  });
  // @ts-ignore
  BigInt.prototype["toJSON"] = function () {
    return this.toString();
  };
  // const res = await db.select({ value: count() }).from(curations);
  return (
    <pre>
      Hello from supabase! Some example logs: {JSON.stringify(dec, null, 2)}
    </pre>
  );
}
