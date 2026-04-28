const API_URL = "http://localhost:3000";

export const shortenUrl = async (url) => {
  const response = await fetch(`${API_URL}/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    throw new Error("Failed to shorten URL");
  }

  return response.json();
};