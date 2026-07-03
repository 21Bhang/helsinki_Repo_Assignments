import { create } from "zustand";
import anecdoteService from "./services/anecdotes";

export const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll();
      set(() => ({ anecdotes }));
    },
    addAnecdote: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content);
      set((state) => ({ anecdotes: [...state.anecdotes, newAnecdote] }));
    },
    // 🚀 Fixed: Finds the item, increases votes, updates backend, then updates state
    voteAnecdote: async (id) => {
      const currentAnecdotes = useAnecdoteStore.getState().anecdotes;
      const anecdoteToVote = currentAnecdotes.find((a) => a.id === id);

      const changedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      };

      const updatedFromServer = await anecdoteService.vote(id, changedAnecdote);

      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === id ? updatedFromServer : a,
        ),
      }));
    },
    setFilter: (value) => set(() => ({ filter: value })),
  },
}));
