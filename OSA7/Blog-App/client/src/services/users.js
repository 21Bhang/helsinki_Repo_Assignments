const baseUrl = '/api/users'

const getAll = async () => {
  const res = await fetch(baseUrl)
  if (!res.ok) throw new Error(`request failed: ${res.status}`)
  return res.json()
}

const getOne = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `request failed: ${res.status}`)
  }
  return res.json()
}

export default { getAll, getOne }
