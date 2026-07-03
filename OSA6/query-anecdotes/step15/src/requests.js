const baseUrl = "http://localhost:3001/anecdotes"; // Double check port in server.js

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error(
      "Anecdote service is not available due to problems on the server",
    );
  }
  return response.json();
};
