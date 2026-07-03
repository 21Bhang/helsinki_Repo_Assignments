import { create } from "zustand";
import anecdoteService from "./services/anecdotes";
import { useNotificationStore } from "./notificationStore"; // 1. Import notification store

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

      // 2. Trigger creation alert banner
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

      // 3. Trigger voting alert banner
      useNotificationStore
        .getState()
        .actions.showNotification(`you voted '${updatedFromServer.content}'`);
    },
    setFilter: (value) => set(() => ({ filter: value })),
  },
}));
