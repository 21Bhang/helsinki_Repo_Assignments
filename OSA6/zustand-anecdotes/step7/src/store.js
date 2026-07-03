import { create } from 'zustand'

export const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  
  setAnecdotes: (anecdotes) => set({ anecdotes }),

  // 🚀 Accepts the saved backend object and adds it straight to the state
  addAnecdote: (newAnecdote) => set((state) => ({
    anecdotes: [...state.anecdotes, newAnecdote]
  })),

  voteAnecdote: (id) => set((state) => ({
    anecdotes: state.anecdotes.map((anecdote) =>
      anecdote.id !== id ? anecdote : { ...anecdote, votes: anecdote.votes + 1 }
    )
  })),

  setFilter: (text) => set({ filter: text }) 
}))
