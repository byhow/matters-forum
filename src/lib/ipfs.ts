import { unixfs } from "@helia/unixfs";
import { createHelia, type HeliaLibp2p } from "helia";
import { UnixFSEntry } from "ipfs-unixfs-exporter";
// import { Readable } from "stream";

let ipfsClient: HeliaLibp2p | undefined;

export const getIpfsClient = async () => {
  if (!ipfsClient) {
    ipfsClient = await createHelia();
  }
  return ipfsClient;
};

export const ipfsLs = async (client: HeliaLibp2p) => {
  const fs = unixfs(client);
  const subDir: UnixFSEntry[] = [];
  for await (const entries of fs.ls(
    `QmWEtNfgQUhYzHcvsPuTSzR23DpF3jgtpEqnphS8LUBzzM` as any // cid
  )) {
    subDir.push(entries);
  }
  return subDir.map((s) => ({
    cid: s.cid,
    type: s.type,
    path: s.path,
    size: Number(s.size),
    name: s.name,
    depth: s.depth,
  }));
}