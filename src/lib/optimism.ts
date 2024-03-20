import { createPublicClient, decodeEventLog, Hex, http, parseAbiItem } from "viem";
import { optimism } from "viem/chains";
import { erc20TokenCurationEventSignature, nativeTokenCurationEventSignature, CURATION_ABI } from "./abi";
import { db } from "./db";
import { curations } from "./db/schema";

if (!process.env.ALCHEMY_OPTIMISM_MAINNET) {
  throw new Error("alchemy endpoint not found");
}

export const publicOptimismClient = createPublicClient({
  chain: optimism,
  transport: http(process.env.ALCHEMY_OPTIMISM_MAINNET),
});

export const indexExampleFilteredLogs = async () => {
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
          amount: logArgs.amount,
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
          amount: logArgs.amount,
        },
        ...baseLog,
      };
    }
  });

  await db.insert(curations).values(dec.map(e => {
    return {
      toAddress: e.address,
      blockNumber: e.blockNumber,
      amount: e.event.amount,
      uri: e.event.uri,
      tokenAddress: e.event.tokenAddress
    }

  })).onConflictDoNothing();
}
