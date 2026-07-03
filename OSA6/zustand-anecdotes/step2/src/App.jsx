import { useAnecdoteStore } from './store'

const App = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const voteAnecdote = useAnecdoteStore((state) => state.voteAnecdote)
  const addAnecdote = useAnecdoteStore((state) => state.addAnecdote)

  const handleSubmit = (event) => {
    event.preventDefault()
    addAnecdote(event.target.anecdote.value)
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <p>{anecdote.content}</p>
          <p>has {anecdote.votes} votes</p>
          <button onClick={() => voteAnecdote(anecdote.id)}>vote</button>
        </div>
      ))}
      
      <form onSubmit={handleSubmit}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App
