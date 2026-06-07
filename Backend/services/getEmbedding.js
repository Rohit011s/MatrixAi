import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});
console.log(process.env.GEMINI_API_KEY);
async function getEmbedding(text) {
  let options = {
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
            text: text,
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
    const data = await response.json();
    const embedding = data.embedding.values;
    return embedding;
  } catch (error) {
    console.error("Api Error:", error);
  }
}

export default getEmbedding;
