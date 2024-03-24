import { load } from "cheerio";
import Highlighter from "react-highlight-words";

type Props = {
  ipfsURL: string;
  txHash: string;
  timeout?: number;
  q?: string | null;
};

const DEFAULT_ERROR = "Public IPFS Gateway won't load content.";

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
    return `${DEFAULT_ERROR} txHash: ${txHash.slice(0, 5)}...${txHash.slice(
      txHash.length - 6,
      txHash.length - 1
    )}`;
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
  q = null,
}: Props) {
  const html = await fetchIpfsTitle(ipfsURL, txHash, timeout);
  let title: string = html;

  if (!html.startsWith(DEFAULT_ERROR)) {
    title = extractTitle(html);
  }

  return q === null ? (
    <p>{title}</p>
  ) : (
    <Highlighter searchWords={[q]} autoEscape={true} textToHighlight={title} />
  );
}
