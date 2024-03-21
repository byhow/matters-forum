import { z } from "zod";
import { createMetadataTaggerFromZod } from "langchain/document_transformers/openai_functions";
import { ChatOpenAI } from "@langchain/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";

const articleSchema = z.object({
  article_title: z.string(),
  author: z.string(),
  date: z.date(),
});

const metadataTagger = createMetadataTaggerFromZod(articleSchema, {
  llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo" }),
});

export const getArticleMetadata = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  // console.log('loading...')
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const transformer = new HtmlToTextTransformer();
  // console.log('transforming...')
  const sequence = splitter.pipe(transformer);

  const documents = await sequence.invoke(docs.slice(0, 2));
  // console.log('tagging...')
  const taggedDocuments = await metadataTagger.transformDocuments(documents);

  return taggedDocuments
}

// getArticleMetadata('https://ipfs.io/ipfs/QmaHs88vA51MQYgyjhhnA8NNfJRddpKFTASfq9psDJ7kYh').then((r) => console.log(r))