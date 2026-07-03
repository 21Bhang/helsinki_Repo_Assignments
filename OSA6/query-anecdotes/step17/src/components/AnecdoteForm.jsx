import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();

  // Define the creation mutation engine
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      // Invalidate cache immediately to force background refetching
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    // As instructed, we do not need to build out complex error handling panels yet
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div
      style={{
        marginBottom: 25,
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Create New Anecdote</h3>
      <form onSubmit={onCreate}>
        <input
          name="anecdote"
          placeholder="Enter anecdote (min 5 characters)..."
          style={{ padding: "6px", width: "300px", marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
