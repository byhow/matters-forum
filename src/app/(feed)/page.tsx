import { db } from "@/lib/db";
import { CURATION_ABI } from "@/lib/abi";
import { publicOptimismClient } from "@/lib/optimism";
import { curations, dump } from "@/lib/db/schema";
import { parseAbiItem, type Hex, decodeEventLog } from "viem";

export default async function Home() {
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

        db.insert(curations).values({
          blockNumber: Number(log.blockNumber),
          toAddress: log.address,
          uri: decoded.args.uri,
          amount: decoded.args.amount,
        });

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
  // // @ts-ignore
  // BigInt.prototype["toJSON"] = function () {
  //   return this.toString();
  // };

  return (
    <div>
      <pre>Hello from supabase!</pre>
    </div>
  );
}
