import { useCreateAnecdoteMutation } from "../hooks/useAnecdotes";
import { useNotify } from "../context/NotificationContext"; // 🚀 Import new custom hook

const AnecdoteForm = () => {
  const newAnecdoteMutation = useCreateAnecdoteMutation();
  const notify = useNotify(); // 🚀 Initialize the notification hook helper

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    newAnecdoteMutation.mutate(
      { content, votes: 0 },
      {
        onSuccess: () => {
          // 🚀 Call the hook directly with a string message payload [1]
          notify(`anecdote '${content}' successfully created`);
        },
        onError: (error) => {
          // 🚀 Forward server validation errors to the hook layer directly [1]
          notify(error.message);
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
