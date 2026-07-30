const baseUrl = '/api/login'

const login = async ({ username, password }) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'invalid username or password')
  }
  return res.json()
}

export default { login }
