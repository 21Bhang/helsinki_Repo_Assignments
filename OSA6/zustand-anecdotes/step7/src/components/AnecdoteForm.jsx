import { useAnecdoteStore } from '../store'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const addAnecdote = useAnecdoteStore((state) => state.addAnecdote)

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    // 1. Send data to server
    const newAnecdote = await anecdoteService.createNew(content)
    // 2. Sync client state
    addAnecdote(newAnecdote)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
