import { create } from "zustand";
import anecdoteService from "./services/anecdotes";
import { useNotificationStore } from "./notificationStore";

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
      useNotificationStore
        .getState()
        .actions.showNotification(`created '${content}'`);
    },
    voteAnecdote: async (id) => {
      const anecdote = useAnecdoteStore
        .getState()
        .anecdotes.find((a) => a.id === id);
      const updatedFromServer = await anecdoteService.vote(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      });

      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === id ? updatedFromServer : a,
        ),
      }));

      useNotificationStore
        .getState()
        .actions.showNotification(`you voted '${updatedFromServer.content}'`);
    },
    deleteAnecdote: async (id) => {
      await anecdoteService.remove(id);
      set((state) => ({
        anecdotes: state.anecdotes.filter((a) => a.id !== id),
      }));
    },
    setFilter: (value) => set(() => ({ filter: value })),
  },
}));
