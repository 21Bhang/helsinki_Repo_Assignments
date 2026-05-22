import { useState } from "react";

const AuthForm = ({ onLogin, onSignup }) => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      await onLogin({ username, password });
    } else {
      await onSignup({ username, name, password });
    }
    setPassword("");
  };

  return (
    <div className="card">
      <div className="tabs">
        <button
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
          type="button"
        >
          Log in
        </button>
        <button
          className={mode === "signup" ? "active" : ""}
          onClick={() => setMode("signup")}
          type="button"
        >
          Sign up
        </button>
      </div>

      <h2>{mode === "login" ? "Log in" : "Create account"}</h2>

      <form onSubmit={submit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </label>

        {mode === "signup" && (
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        )}

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={3}
          />
        </label>

        <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
      </form>
    </div>
  );
};

export default AuthForm;
