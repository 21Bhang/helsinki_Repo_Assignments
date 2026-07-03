import { useAnecdoteStore } from '../store'

const AnecdoteForm = () => {
  const addAnecdote = useAnecdoteStore((state) => state.addAnecdote)

  const handleSubmit = (event) => {
    event.preventDefault()
    addAnecdote(event.target.anecdote.value)
    event.target.anecdote.value = ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
