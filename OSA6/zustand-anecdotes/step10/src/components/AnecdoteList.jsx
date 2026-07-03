import { useAnecdoteStore } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter);
  const actions = useAnecdoteStore((state) => state.actions);

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase()),
  );

  const sortedAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => b.votes - a.votes,
  );

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div
          key={anecdote.id}
          style={{
            marginBottom: 10,
            padding: "5px",
            borderBottom: "1px dashed #ccc",
          }}
        >
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => actions.voteAnecdote(anecdote.id)}
              style={{ marginLeft: 5 }}
            >
              vote
            </button>
            {/* 🚀 Render delete button only if votes count is exactly 0 */}
            {anecdote.votes === 0 && (
              <button
                onClick={() => actions.deleteAnecdote(anecdote.id)}
                style={{ marginLeft: 10, color: "red" }}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
