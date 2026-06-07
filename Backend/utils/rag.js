import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs/promises";
import path from "path";
import getEmbedding from "../services/getEmbedding.js";
import Rag from "../models/RagDoc.js";

function cleanText(text) {
  return text.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

async function fileChunker(filePath) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  let text = await fs.readFile(filePath, "utf8");
  text = cleanText(text);

  return splitter.createDocuments([text], [
    {
      source: path.basename(filePath),
    },
  ]);
}

async function saveDoc(filePath) {
  const chunks = await fileChunker(filePath);

  const docs = [];

  for (const [index, chunk] of chunks.entries()) {
    const embedding = await getEmbedding(chunk.pageContent);

    docs.push({
      text: chunk.pageContent,
      embedding,
      source: chunk.metadata.source,
      chunkIndex: index,
    });
  }

  await Rag.insertMany(docs);

  console.log(`${docs.length} chunks saved`);
  return docs;
}

export default saveDoc;