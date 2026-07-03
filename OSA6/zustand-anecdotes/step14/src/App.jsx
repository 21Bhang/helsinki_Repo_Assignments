import { useEffect } from "react";
import { useAnecdoteStore } from "./store";
import Filter from "./components/Filter";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Notification from "./components/Notification"; // Import the UI component

const App = () => {
  const actions = useAnecdoteStore((state) => state.actions);

  useEffect(() => {
    actions.initialize();
  }, [actions]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification /> {/* Render it here */}
      <Filter />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  );
};

export default App;
