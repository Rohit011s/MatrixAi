import mongoose from "mongoose";

import getEmbedding from "./getEmbedding.js";
import Rag from "../models/RagDoc.js";
import cosineSimilarity from "../utils/cosineSimilarity.js";

async function retriveDoc(query = "what is rohit secret code") {
  try {

  const queryEmbedding = await getEmbedding(query);
const docs = await Rag.find(
  {},
  {
    text: 1,
    embedding: 1
  }
).lean();
const context = docs
    .map((doc) => ({
      text: doc.text,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((doc) => doc.text)
    .join("\n\n");
    return context;

  } catch (error) {
    console.error("RETRIEVE ERROR");
    console.error(error);

    throw error;
  }
}

export default retriveDoc;