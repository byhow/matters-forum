import { db } from "@/lib/db";
import {
  CURATION_ABI,
  erc20TokenCurationEventSignature,
  nativeTokenCurationEventSignature,
} from "@/lib/abi";
import { publicOptimismClient } from "@/lib/optimism";
import { dump } from "@/lib/db/schema";
import { parseAbiItem, type Hex, decodeEventLog } from "viem";

export default async function Home() {
  const [erc20Logs, nativeLogs] = await Promise.all([
    publicOptimismClient.getFilterLogs({
      filter: await publicOptimismClient.createEventFilter({
        event: parseAbiItem(erc20TokenCurationEventSignature),
        fromBlock: BigInt(117622710),
        toBlock: BigInt(117638279),
      }),
    }),
    publicOptimismClient.getFilterLogs({
      filter: await publicOptimismClient.createEventFilter({
        event: parseAbiItem(nativeTokenCurationEventSignature),
        fromBlock: BigInt(117622710),
        toBlock: BigInt(117638279),
      }),
    }),
  ]);

  const dec = [...erc20Logs, ...nativeLogs].map((log) => {
    const { args: logArgs } = decodeEventLog({
      abi: CURATION_ABI,
      data: log.data,
      topics: log.topics as [signature: `0x${string}`, ...hex: Hex[]],
    });
    const baseLog = {
      txHash: log.transactionHash,
      address: log.address,
      blockNumber: Number(log.blockNumber),
      removed: log.removed,
    };
    if ("curator" in logArgs) {
      return {
        event: {
          curatorAddress: logArgs.curator.toLowerCase(),
          creatorAddress: logArgs.creator.toLowerCase(),
          uri: logArgs.uri,
          tokenAddress: logArgs.token.toLowerCase(),
          amount: logArgs.amount.toString(),
        },
        ...baseLog,
      };
    } else {
      return {
        event: {
          curatorAddress: logArgs.from.toLowerCase(),
          creatorAddress: logArgs.to.toLowerCase(),
          uri: logArgs.uri,
          tokenAddress: null,
          amount: logArgs.amount.toString(),
        },
        ...baseLog,
      };
    }
  });

  publicOptimismClient.watchContractEvent({
    address: "0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8",
    abi: CURATION_ABI,
    eventName: "Curation",
    onLogs: (logs) => {
      const decodedLogs = logs.map((log) => {
        return decodeEventLog({
          abi: CURATION_ABI,
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
    <div>
      <pre>
        Hello from supabase! The node is currently: Some example logs:
        {JSON.stringify(dec, null, 2)}
      </pre>
    </div>
  );
}
