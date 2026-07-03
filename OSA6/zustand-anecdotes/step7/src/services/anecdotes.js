const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) throw new Error('Network error fetching data')
  return response.json()
}

// 🚀 New function to save an anecdote to the database
const createNew = async (content) => {
  const object = { content, votes: 0 } // Database creates 'id' automatically
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(object),
  })
  if (!response.ok) throw new Error('Network error saving data')
  return response.json()
}

export default { getAll, createNew }
