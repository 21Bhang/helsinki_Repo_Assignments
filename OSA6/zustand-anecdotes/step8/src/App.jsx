import { useEffect } from "react";
import { useAnecdoteStore } from "./store";
import anecdoteService from "./services/anecdotes";
import Filter from "./components/Filter";
import AnecdoteList from "./components/AnecdoteList";
// 1. Import the form component
import AnecdoteForm from "./components/AnecdoteForm";

const App = () => {
  const setAnecdotes = useAnecdoteStore((state) => state.setAnecdotes);

  useEffect(() => {
    anecdoteService
      .getAll()
      .then((initialAnecdotes) => {
        setAnecdotes(initialAnecdotes);
      })
      .catch((error) => console.error("Failed to fetch anecdotes:", error));
  }, [setAnecdotes]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      {/* 2. Render it here so the input field and create button show up */}
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  );
};

export default App;
