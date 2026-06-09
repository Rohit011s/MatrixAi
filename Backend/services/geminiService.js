import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

// Load Gemini response for a given prompt
async function geminiService(prompt) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      options,
    );
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.status}`);
    }
    const data = await response.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("API Error:", error);
  }
}

export default geminiService;
