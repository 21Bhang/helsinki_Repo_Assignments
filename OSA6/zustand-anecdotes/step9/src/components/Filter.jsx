import { useAnecdoteStore } from '../store'

const Filter = () => {
  // Grab setFilter directly from the state
  const setFilter = useAnecdoteStore((state) => state.setFilter)

  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const style = { marginBottom: 10 }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
