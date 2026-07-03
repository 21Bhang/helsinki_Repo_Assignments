import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "./requests"; // 1. Import updateAnecdote
import AnecdoteForm from "./components/AnecdoteForm";
import Filter from "./components/Filter";

const App = () => {
  const [filterText, setFilterText] = useState("");
  const queryClient = useQueryClient(); // 2. Access the queryClient instance

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  // 3. Define the update/voting mutation engine
  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      // Invalidate the cache to automatically trigger a background refetch
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
  });

  if (result.isPending) {
    return (
      <div style={{ padding: 20 }}>Loading application database data...</div>
    );
  }

  if (result.isError) {
    return (
      <div style={{ padding: 20, color: "red", fontWeight: "bold" }}>
        Anecdote service is not available due to problems on the server.
      </div>
    );
  }

  const anecdotes = result.data;

  // 4. Handle vote button click handler
  const handleVote = (anecdote) => {
    // Pass the full object with the incremented vote value
    voteAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    });
  };

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filterText.toLowerCase()),
  );

  const sortedAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => b.votes - a.votes,
  );

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Anecdote App (TanStack Query Edition)</h2>

      <Filter filter={filterText} setFilter={setFilterText} />
      <AnecdoteForm />

      <h3 style={{ borderBottom: "2px solid #333", paddingBottom: "5px" }}>
        Anecdotes List
      </h3>
      {sortedAnecdotes.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{
            padding: "10px 0",
            borderBottom: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <div style={{ fontSize: "16px", lineHeight: "1.4" }}>
            {anecdote.content}
          </div>
          <div
            style={{
              color: "#666",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>
              Has <strong>{anecdote.votes}</strong> votes
            </span>

            {/* 🚀 Render vote button linked to mutation handler */}
            <button
              onClick={() => handleVote(anecdote)}
              style={{ padding: "2px 8px", cursor: "pointer" }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
