import { useNavigate } from 'react-router-dom'
import useUserStore from '../store/userStore'
import useNotificationStore from '../store/notificationStore'
import useField from '../hooks/useField'

const LoginPage = () => {
  const username = useField('text', { autoComplete: 'username' })
  const password = useField('password', { autoComplete: 'current-password' })
  const login = useUserStore((s) => s.login)
  const notify = useNotificationStore((s) => s.notify)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await login({
        username: username.value,
        password: password.value,
      })
      notify(`Welcome back, ${user.name || user.username}`)
      username.reset()
      password.reset()
      navigate('/')
    } catch (err) {
      notify(`Login failed: ${err.message}`, 'error')
    }
  }

  return (
    <div className="login-wrapper">
      <h2>Log in to application</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>username</label>
          <input {...username.asProps} />
        </div>
        <div className="field">
          <label>password</label>
          <input {...password.asProps} />
        </div>
        <div className="form-actions">
          <button className="btn" type="submit">
            login
          </button>
        </div>
      </form>
      {/* <p className="hint">
        Demo credentials &mdash; username <strong>mluukkai</strong>, password{' '}
        <strong>salainen</strong> (or <strong>root</strong> /{' '}
        <strong>sekret</strong>).
      </p> */}
    </div>
  )
}

export default LoginPage
