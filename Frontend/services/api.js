//Base url
const BASE_URL = import.meta.env.VITE_API_URL;

// Reusable API request helper
async function request(endpoint, options = {}) {
  // Check if request body contains FormData
  const isFormData = options.body instanceof FormData;

  // Send HTTP request to backend
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    // Include session cookies with every request
    credentials: "include",
    ...options,
    // Skip Content-Type header for FormData requests
    headers: isFormData
      ? options.headers
      : {
          "Content-Type": "application/json",
          ...options.headers,
        },
  });

  // Parse response body as JSON
  const data = await response.json().catch(() => ({}));

  // Handle API error responses
  if (!response.ok) {
    // Create error using backend message
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }

  // Return successful API response data
  return data;
}

export default request;
