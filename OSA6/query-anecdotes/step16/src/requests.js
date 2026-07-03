const baseUrl = "http://localhost:3001/anecdotes";

// Fetch all elements from backend database
export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("Anecdote service not available due to server issues");
  }
  return response.json();
};

// Persist a new anecdote object to the database server
export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAnecdote),
  });
  if (!response.ok) {
    throw new Error("Failed to create new anecdote");
  }
  return response.json();
};
