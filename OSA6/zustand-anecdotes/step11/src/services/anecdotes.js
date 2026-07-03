const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error("Failed to fetch anecdotes");
  return await response.json();
};

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, votes: 0 }),
  });
  if (!response.ok) throw new Error("Failed to create anecdote");
  return await response.json();
};

// 🚀 Saves the updated vote count directly to the server database
const vote = async (id, updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedAnecdote),
  });
  if (!response.ok) throw new Error("Failed to save vote");
  return await response.json();
};

// 🚀 New function to delete an entry from the backend database
const remove = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete anecdote");
};

export default { getAll, createNew, vote, remove };
