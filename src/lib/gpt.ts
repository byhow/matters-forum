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
  description: z
    .optional(z.string())
    .describe("A brief summary of the article or the pull quotes"),
});

const metadataTagger = createMetadataTaggerFromZod(articleSchema, {
  llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo" }),
});

export const getArticleMetadata = async (url: string) => {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const transformer = new HtmlToTextTransformer();

  const sequence = splitter.pipe(transformer);

  const documents = await sequence.invoke(docs);

  const taggedDocuments = await metadataTagger.transformDocuments(documents);

  return taggedDocuments
}

