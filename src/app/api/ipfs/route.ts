// import { getIpfsClient, ipfsLs } from "@/lib/ipfs";
// import { unixfs } from "@helia/unixfs";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextResponse) {
  // TODO: something really wrong about using @helia/unixfs, very capricious
  // const ipfsClient = await getIpfsClient();
  // const subs = await ipfsLs(ipfsClient)
  // let cid = subs[0].cid

  // if (subs.length > 1) {
  //   for (const child of subs) {
  //     if (child.name === 'index.html') {
  //       cid = child.cid;
  //       break;
  //     }
  //   }
  // }

  // const fs = unixfs(ipfsClient!);
  // const decoder = new TextDecoder()
  // let text = ''
  // for await (const chunk of fs.cat(cid, {
  //   onProgress: (evt) => {
  //     console.info('cat event', evt.type, evt.detail)
  //   }
  // })) {
  //   text += decoder.decode(chunk, {
  //     stream: true
  //   })
  // }
  // return new NextResponse(text)
  return NextResponse.json({ message: "ipfs checkpoint" }, { status: 200 })
}