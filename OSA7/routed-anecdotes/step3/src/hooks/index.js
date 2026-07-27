import { useState, useEffect } from "react";
import * as anecdoteService from "../services/anecdotes";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    type,
    value,
    onChange,
    reset,
  };
};

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data));
  }, []);

  const addAnecdote = async (anecdoteObject) => {
    const savedAnecdote = await anecdoteService.createNew(anecdoteObject);
    setAnecdotes(anecdotes.concat(savedAnecdote));
  };

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id);
    setAnecdotes(anecdotes.filter((a) => a.id !== id));
  };

  return { anecdotes, addAnecdote, deleteAnecdote };
};
