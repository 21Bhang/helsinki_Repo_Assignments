import { useState } from 'react'
import useUserStore from '../stores/userStore'

const Login = () => {
  const [username, setUsername] = useState('')
  const { login } = useUserStore()

  const handleLogin = e => {
    e.preventDefault()
    if (username) {
      login(username)
      setUsername('')
    }
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>username:</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">
          login
        </button>
      </form>
    </div>
  )
}

export default Login
