import { publicOptimismClient } from "./optimism";
import { curationAbi } from "./abi";
import { db } from "./db";
import { dump } from "./db/schema";

export const unwatch = publicOptimismClient.watchContractEvent({
  address: "0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8",
  abi: curationAbi,
  eventName: "Curation",
  onLogs: (logs) => {
    db.insert(dump).values({ eventDump: JSON.stringify(logs) });
  },
});
