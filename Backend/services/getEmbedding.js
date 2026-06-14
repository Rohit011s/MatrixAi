import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

// Generate embedding vector for a piece of text
async function getEmbedding(text) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      taskType: "SEMANTIC_SIMILARITY",
      content: {
        parts: [
          {
            text,
          },
        ],
      },
    }),
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent",
      options,
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }
    const data = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error("API Error:", error);
  }
}

export default getEmbedding;
