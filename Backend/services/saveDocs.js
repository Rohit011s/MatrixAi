import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs/promises";
import path from "path";

import getEmbedding from "./getEmbedding.js";
import Rag from "../models/RagDoc.js";

/*
  Clean text before chunking.

  Removes:
  - Line breaks
  - Extra spaces

  This produces cleaner chunks and
  better embedding quality.
*/
function cleanText(text) {
  return text.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

/*
  Read uploaded file and split it into chunks.

  Chunk Size:
  1000 characters

  Chunk Overlap:
  200 characters

  Overlap helps preserve context between chunks.
*/
async function createChunks(filePath) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const text = cleanText(
    await fs.readFile(filePath, "utf8")
  );

  if (!text) {
    throw new Error("File is empty.");
  }

  return splitter.createDocuments(
    [text],
    [
      {
        source: path.basename(filePath),
      },
    ]
  );
}

/*
  Save document chunks into vector database.

  Flow:
  File
    ↓
  Chunking
    ↓
  Embedding Generation
    ↓
  MongoDB Storage
*/
async function saveDoc(filePath, documentId, userId) {
  try {
    const chunks = await createChunks(filePath);

    if (chunks.length === 0) {
      throw new Error(
        "No chunks generated from file."
      );
    }

    const docs = await Promise.all(
      chunks.map(async (chunk, index) => {
        const embedding = await getEmbedding(
          chunk.pageContent
        );

        return {
          document_id: documentId,
          user_id: userId,
          text: chunk.pageContent,
          embedding,
          source: chunk.metadata.source,
          chunkIndex: index,
        };
      })
    );

    await Rag.insertMany(docs);

    return docs;
  } catch (error) {
    console.error(
      "DOCUMENT SAVE ERROR:",
      error.message
    );

    throw error;
  }
}

export default saveDoc;