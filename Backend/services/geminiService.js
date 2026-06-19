
/*
  Gemini Service

  Purpose:
  - Send a prompt to Gemini API
  - Return generated response
  - Handle API failures gracefully
  - Prevent application crashes when Gemini is unavailable
*/
async function geminiService(prompt) {
  try {
    // Send POST request to Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // Gemini API key stored securely in .env
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },

        // User prompt sent to Gemini
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
      }
    );

    // Convert API response into JSON
    const data = await response.json();

    /*
      If Gemini returns an error:
      Examples:
      - 429 (Quota exceeded)
      - 503 (Server busy)
      - 401 (Invalid API key)

      Return a structured error object
      instead of crashing the application.
    */
    if (!response.ok) {
      console.error("Gemini API Error:", data);

      return {
        success: false,
        status: response.status,
        message:
          data?.error?.message ||
          "Gemini API request failed",
      };
    }

    // Successful response
    return {
      success: true,
      data,
    };
  } catch (error) {
    /*
      Handles:
      - Internet connection issues
      - DNS failures
      - Fetch failures
      - Unexpected runtime errors
    */

    console.error("Network Error:", error);

    return {
      success: false,
      status: 500,
      message: error.message || "Network error",
    };
  }
}

export default geminiService;