import { createPublicClient, http } from "viem";
import { optimism } from "viem/chains";

if (!process.env.ALCHEMY_OPTIMISM_MAINNET) {
  throw new Error("alchemy endpoint not found");
}

export const publicOptimismClient = createPublicClient({
  chain: optimism,
  transport: http(process.env.ALCHEMY_OPTIMISM_MAINNET),
});
