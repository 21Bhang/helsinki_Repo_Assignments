import { create } from "zustand";
import anecdoteService from "./services/anecdotes";

export const useAnecdoteStore = create((set, get) => ({
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
      useNotificationStore
        .getState()
        .actions.showNotification(`created '${content}'`);
    },
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
      useNotificationStore
        .getState()
        .actions.showNotification(`you voted '${updatedFromServer.content}'`);
    },

    // 🚀 New action: Deletes item only if it has 0 votes
    deleteAnecdote: async (id) => {
      const currentAnecdotes = useAnecdoteStore.getState().anecdotes;
      const anecdoteToDelete = currentAnecdotes.find((a) => a.id === id);

      // Guard clause to make sure users can't delete voted anecdotes
      if (anecdoteToDelete && anecdoteToDelete.votes === 0) {
        await anecdoteService.remove(id);

        set((state) => ({
          anecdotes: state.anecdotes.filter((a) => a.id !== id),
        }));

        useNotificationStore
          .getState()
          .actions.showNotification(`deleted '${anecdoteToDelete.content}'`);
      }
    },

    setFilter: (value) => set(() => ({ filter: value })),
  },
}));
