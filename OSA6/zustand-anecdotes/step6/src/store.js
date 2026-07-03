import { create } from 'zustand'

export const useAnecdoteStore = create((set) => ({
  anecdotes: [], // Start with an empty array now
  filter: '',
  
  // Action to initialize anecdotes from the backend
  setAnecdotes: (anecdotes) => set({ anecdotes }),

  voteAnecdote: (id) => set((state) => ({
    anecdotes: state.anecdotes.map((anecdote) =>
      anecdote.id !== id ? anecdote : { ...anecdote, votes: anecdote.votes + 1 }
    )
  })),
  
  addAnecdote: (content) => set((state) => ({
    anecdotes: [...state.anecdotes, { content, id: String(Math.random()), votes: 0 }]
  })),

  setFilter: (text) => set({ filter: text }) 
}))
