import { useQuery } from "@tanstack/react-query";
import { getAnecdotes } from "./requests";

const App = () => {
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1, // Retries only once before showing the error screen
  });

  // 1. Show a quick message while waiting for data or retry
  if (result.isPending) {
    return <div>loading data...</div>;
  }

  // 2. Show the dedicated error page if communication fails
  if (result.isError) {
    return (
      <div style={{ padding: 20, color: "red", fontWeight: "bold" }}>
        anecdote service not available due to problems in server
      </div>
    );
  }

  const anecdotes = result.data;

  return (
    <div>
      <h2>Anecdote App (TanStack Query)</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: 10 }}>
          <div>{anecdote.content}</div>
          <div>has {anecdote.votes} votes</div>
        </div>
      ))}
    </div>
  );
};

export default App;
