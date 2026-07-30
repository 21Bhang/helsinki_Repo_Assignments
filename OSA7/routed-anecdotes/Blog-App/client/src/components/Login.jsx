import { useField } from '../hooks/useField.js'
import useUserStore from '../stores/userStore.js'

const Login = () => {
  const username = useField('text')
  const { login } = useUserStore()

  const handleLogin = async e => {
    e.preventDefault()
    if (username.value) {
      await login(username.value)
      username.reset()
    }
  }

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>username:</label>
          <input {...username.input} required />
        </div>
        <button type="submit" className="btn btn-primary">
          login
        </button>
      </form>
    </div>
  )
}

export default Login
