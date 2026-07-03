import { useAnecdoteStore } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const voteAnecdote = useAnecdoteStore((state) => state.voteAnecdote)

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <p>{anecdote.content}</p>
          <p>has {anecdote.votes} votes</p>
          <button onClick={() => voteAnecdote(anecdote.id)}>vote</button>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
