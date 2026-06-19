
/*
  Generate Embedding

  Purpose:
  Convert text into a numerical vector representation.

  Used for:
  - Document embeddings during upload
  - Query embeddings during retrieval

  These embeddings are later compared using
  cosine similarity to find relevant chunks.
*/

async function getEmbedding(text) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // API key stored securely in .env
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
      }
    );

    const data = await response.json();

    /*
      Handle Gemini embedding API failures.

      Examples:
      - 401 Invalid API Key
      - 429 Quota Exceeded
      - 503 Service Busy
    */
    if (!response.ok) {
      throw new Error(
        data?.error?.message ||
          `Embedding API Error: ${response.status}`
      );
    }

    const embedding = data?.embedding?.values;

    if (!embedding) {
      throw new Error(
        "No embedding returned from Gemini."
      );
    }

    return embedding;
  } catch (error) {
    console.error(
      "EMBEDDING ERROR:",
      error.message
    );

    throw error;
  }
}

export default getEmbedding;