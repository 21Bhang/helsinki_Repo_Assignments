const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error("Service unavailable");
  return response.json();
};

export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAnecdote),
  });
  if (!response.ok) throw new Error("Failed to create new anecdote");
  return response.json();
};

// 🚀 New helper function to update an anecdote's vote count on the backend server
export const updateAnecdote = async (updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAnecdote),
  });
  if (!response.ok) throw new Error("Failed to update anecdote");
  return response.json();
};
