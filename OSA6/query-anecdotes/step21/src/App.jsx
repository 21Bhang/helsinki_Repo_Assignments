import { useState } from "react";
import {
  useAnecdotesQuery,
  useVoteAnecdoteMutation,
} from "./hooks/useAnecdotes";
import { useNotify } from "./context/NotificationContext"; // 🚀 Import new custom hook
import AnecdoteForm from "./components/AnecdoteForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
  const [filterText, setFilterText] = useState("");
  const result = useAnecdotesQuery();
  const voteAnecdoteMutation = useVoteAnecdoteMutation();
  const notify = useNotify(); // 🚀 Initialize the notification hook helper

  if (result.isPending) return <div style={{ padding: 20 }}>Loading...</div>;
  if (result.isError)
    return <div style={{ padding: 20 }}>Service Unavailable</div>;

  const anecdotes = result.data;

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(
      {
        ...anecdote,
        votes: anecdote.votes + 1,
      },
      {
        onSuccess: (updatedFromServer) => {
          // 🚀 Simply trigger with the string value [1]
          notify(`anecdote '${updatedFromServer.content}' voted`);
        },
      },
    );
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
      <Notification />
      <Filter filter={filterText} setFilter={setFilterText} />
      <AnecdoteForm />

      <h3 style={{ borderBottom: "2px solid #333", paddingBottom: "5px" }}>
        Anecdotes List
      </h3>
      {sortedAnecdotes.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}
        >
          <div style={{ fontSize: "16px" }}>{anecdote.content}</div>
          <div style={{ color: "#666", fontSize: "14px", marginTop: 5 }}>
            <span>
              Has <strong>{anecdote.votes}</strong> votes
            </span>
            <button
              onClick={() => handleVote(anecdote)}
              style={{ marginLeft: 10 }}
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
