import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    // Bump retryCount so the wrapped subtree fully remounts (via the key
    // below) and gets a clean render — even on the same route.
    this.setState((s) => ({
      hasError: false,
      error: null,
      retryCount: s.retryCount + 1,
    }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h2>Something went wrong</h2>
          <p>
            An unexpected error occurred while rendering this part of the
            application. You can try again &mdash; the navigation above is still
            available.
          </p>
          {this.state.error && <pre>{this.state.error.toString()}</pre>}
          <button className="btn" onClick={this.handleReset}>
            Try again
          </button>
        </div>
      )
    }
    // The key forces a fresh mount of children after a retry, so any
    // component that threw is re-created from scratch.
    return <div key={this.state.retryCount}>{this.props.children}</div>
  }
}
