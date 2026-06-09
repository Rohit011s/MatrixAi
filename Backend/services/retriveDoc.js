import mongoose from "mongoose";

import getEmbedding from "./getEmbedding.js";
import Rag from "../models/RagDoc.js";
import cosineSimilarity from "../utils/cosineSimilarity.js";

async function retriveDoc(query = "computer can store") {
  console.log("Start retrieve");

  console.log("Before get embedding");
  const queryEmbedding = await getEmbedding(query);
  console.log("After get embedding");

  console.log("Before get all docs");
  console.log("Ready State:", mongoose.connection.readyState);

  const docs = await Rag.find();

  console.log("After get all docs");

  // Find the most relevant chunks using cosine similarity
  console.log("Before context generation");

  const context = docs
    .map((doc) => ({
      text: doc.text,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((doc) => doc.text)
    .join("\n\n");

  console.log("After context generation");

  return context;
}

export default retriveDoc;