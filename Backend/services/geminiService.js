import dotenv from "dotenv";

dotenv.config({
  path: "../.env"
});
async function GenerateContent(promt) {
  let options = {
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
              text: promt,
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
    const data = await response.json();
    let newData = data.candidates[0].content.parts[0].text;
    return newData;
  } catch (error) {
    console.error("Api Error:", error);
  }
}

export { GenerateContent };
