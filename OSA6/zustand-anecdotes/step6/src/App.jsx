import { useEffect } from 'react'
import { useAnecdoteStore } from './store'
import anecdoteService from './services/anecdotes'
import Filter from './components/Filter'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  const setAnecdotes = useAnecdoteStore((state) => state.setAnecdotes)

  useEffect(() => {
    anecdoteService.getAll()
      .then((initialAnecdotes) => {
        setAnecdotes(initialAnecdotes)
      })
      .catch((error) => console.error('Failed to fetch anecdotes:', error))
  }, [setAnecdotes]) // Runs exactly once when the application starts

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
    </div>
  )
}

export default App
