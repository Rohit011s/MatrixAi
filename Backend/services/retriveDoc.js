import getEmbedding from "./getEmbedding.js";
import Rag from "../models/RagDoc.js";
import cosineSimilarity from "../utils/cosineSimilarity.js";

/*
  Retrieve Document Context

  Purpose:
  - Convert user query into embedding
  - Search only selected documents
  - Calculate similarity score
  - Return top 3 most relevant chunks

  This is the retrieval step of the RAG pipeline.
*/

async function retriveDoc(query, selectedfiles, userId) {
  try {
    // Ensure at least one file is selected
    if (!selectedfiles || selectedfiles.length === 0) {
      throw new Error("No files selected for RAG.");
    }

    // Generate embedding for user's question
    const queryEmbedding = await getEmbedding(query);

    // Retrieve chunks belonging only to the selected files
    const docs = await Rag.find({
      user_id: userId,
      document_id: { $in: selectedfiles },
    }).lean();

    // No matching chunks found
    if (docs.length === 0) {
      throw new Error("No matching documents found.");
    }

    /*
      Calculate similarity between:
      User Query Embedding
      vs
      Chunk Embedding

      Higher score = More relevant chunk
    */
    const context = docs
      .map((doc) => ({
        text: doc.text,
        score: cosineSimilarity(
          queryEmbedding,
          doc.embedding
        ),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((doc) => doc.text)
      .join("\n\n");

    return context;
  } catch (error) {
    console.error("RETRIEVE ERROR:", error.message);
    throw error;
  }
}

export default retriveDoc;