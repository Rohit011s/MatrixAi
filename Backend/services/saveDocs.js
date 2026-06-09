import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs/promises";
import path from "path";

import getEmbedding from "./getEmbedding.js";
import Rag from "../models/RagDoc.js";

// Remove extra spaces and line breaks before chunking
function cleanText(text) {
  return text.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

// Read a file and split it into overlapping chunks
async function createChunks(filePath) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const text = cleanText(
    await fs.readFile(filePath, "utf8")
  );

  if (!text) {
    throw new Error("File is empty");
  }

  return splitter.createDocuments([text], [
    {
      source: path.basename(filePath),
    },
  ]);
}

// Generate embeddings for each chunk and store them in MongoDB
async function saveDoc(filePath) {
  const chunks = await createChunks(filePath);

  const docs = await Promise.all(
    chunks.map(async (chunk, index) => {
      const embedding = await getEmbedding(chunk.pageContent);
      return {
        text: chunk.pageContent,
        embedding,
        source: chunk.metadata.source,
        chunkIndex: index,
      };
    })
  );

  await Rag.insertMany(docs);

  console.log(`${docs.length} chunks saved`);
  return docs;
}

export default saveDoc;


  // for (const [index, chunk] of chunks.entries()) {
  //   const embedding = await getEmbedding(chunk.pageContent);

   