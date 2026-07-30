const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken
}

const getConfig = (extra = {}) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...extra,
  }
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
  }
  return config
}

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

const create = async (newBlog) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    ...getConfig(),
    body: JSON.stringify(newBlog),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `request failed: ${res.status}`)
  }
  return res.json()
}

const update = async (id, updatedBlog) => {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    ...getConfig(),
    body: JSON.stringify(updatedBlog),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `request failed: ${res.status}`)
  }
  return res.json()
}

const remove = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
    ...getConfig(),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `request failed: ${res.status}`)
  }
  return res
}

const addComment = async (id, content) => {
  const res = await fetch(`${baseUrl}/${id}/comments`, {
    method: 'POST',
    ...getConfig(),
    body: JSON.stringify({ content }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `request failed: ${res.status}`)
  }
  return res.json()
}

export default {
  getAll,
  getOne,
  create,
  update,
  remove,
  addComment,
  setToken,
}
