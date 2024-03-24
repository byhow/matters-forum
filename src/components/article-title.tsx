import { load } from "cheerio";

type Props = {
  ipfsURL: string;
  txHash: string;
  timeout?: number;
};

const DEFAULT_ERROR = "Public IPFS Gateway wont load URL.";

const fetchIpfsTitle = async (
  ipfsURL: string,
  txHash: string,
  timeout = 5000
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const resp = await fetch(ipfsURL, {
      signal: controller.signal,
    });
    return resp.text();
    // do the parsing
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `It took too long. We are using an public IPFS gateway, so it happens. ipfs address is ${ipfsURL}`
      );
    } else {
      throw error;
    }
    return `${DEFAULT_ERROR} Here is the txHash: ${txHash}`;
  } finally {
    clearTimeout(timeoutId);
  }
};

const extractTitle = (html: string) => {
  const $ = load(html);
  const h1Element = $("h1");
  return h1Element ? h1Element.text() : "No title found";
};

export default async function ArticleTitle({
  ipfsURL,
  txHash,
  timeout,
}: Props) {
  const html = await fetchIpfsTitle(ipfsURL, txHash, timeout);
  let title: string = html;

  if (!html.startsWith(DEFAULT_ERROR)) {
    title = extractTitle(html);
  }

  return <p>{title}</p>;
}
