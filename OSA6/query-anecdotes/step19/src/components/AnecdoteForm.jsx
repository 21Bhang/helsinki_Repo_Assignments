import { useCreateAnecdoteMutation } from "../hooks/useAnecdotes";
import { useNotificationDispatch } from "../context/NotificationContext"; // 🚀 Import dispatcher hook

const AnecdoteForm = () => {
  const newAnecdoteMutation = useCreateAnecdoteMutation();
  const dispatch = useNotificationDispatch(); // 🚀 Initialize dispatcher

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onSuccess: () => {
          // 🚀 Set the notification and clear it after 5 seconds
          dispatch({
            type: "SET",
            payload: `anecdote '${content}' successfully created`,
          });
          setTimeout(() => dispatch({ type: "CLEAR" }), 5000);
        },
      },
    );
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
