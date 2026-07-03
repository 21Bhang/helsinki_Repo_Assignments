import { useAnecdoteStore } from "../store";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
  // 1. Grab the actions object from the store instead of addAnecdote directly
  const actions = useAnecdoteStore((state) => state.actions);

  const onCreate = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";

    // 2. Call the action safely through the actions object
    await actions.addAnecdote(content);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>create new</h2>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
