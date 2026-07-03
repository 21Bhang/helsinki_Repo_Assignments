import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnecdotes } from "./requests";
import AnecdoteForm from "./components/AnecdoteForm";
import Filter from "./components/Filter";

const App = () => {
  const [filterText, setFilterText] = useState("");

  // Query configuration reading initial state values
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1, // Retries once upon network failures before mounting the error screen
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

  // Perform case-insensitive match on data stream array elements
  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filterText.toLowerCase()),
  );

  // Sort components descending so highest votes show first
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

      {/* Search Input Filter Controls */}
      <Filter filter={filterText} setFilter={setFilterText} />

      {/* Creation Submission Actions Row */}
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
          <div style={{ color: "#666", fontSize: "14px" }}>
            Has <strong>{anecdote.votes}</strong> votes
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
