import { useEffect, useState } from "react";

import "./LoginPage.css";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({
  onLogin,
}: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPage, setShowRegisterPage] = useState(false);

useEffect(() => {
  const savedUsername = getRememberedUsername();

  if (savedUsername) {
    setUsername(savedUsername);
    setRememberMe(true);
  }
}, []);


const handleRememberMeChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const checked = event.target.checked;

  setRememberMe(checked);

  if (!checked) {
    document.cookie =
      "rememberedUsername=; max-age=0; path=/; SameSite=Lax";
  }
};

const getRememberedUsername = (): string | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("rememberedUsername="));

  if (!cookie) {
    return null;
  }

  const savedUsername = cookie.substring(
    "rememberedUsername=".length
  );

  return decodeURIComponent(savedUsername);
};

const handleSubmitLogin = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Login failed");
      return;
    }

    //remember username in cookie for 30 days if rememberMe is checked, otherwise delete the cookie
    if (rememberMe) {
      document.cookie = `rememberedUsername=${encodeURIComponent(username)}; max-age=2592000; path=/; SameSite=Lax`;
    } else {
      document.cookie =
        "rememberedUsername=; max-age=0; path=/; SameSite=Lax";
    }

    setShowPassword(false);
    onLogin();
  } catch (error) {
    console.error("Login error:", error);
    setError("Unable to connect to the server");
  } finally {
    setLoading(false);
  }
};





const handleSubmitRegister = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }

    // Successful registration
    setSuccess("Registration successful!");

    setShowPassword(false);
  } catch (error) {
    console.error("Registration error:", error);
    setError("Unable to connect to the server");
  } finally {
    setLoading(false);
  }
};


  return (
    showRegisterPage ? (
      <div className="login-page">
      <form className="login-form" onSubmit={handleSubmitRegister}>
        <div className="login-header">
          <h1>Discueue</h1>
        </div>

        <h2>Register</h2>

        <div className="login-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">Password</label>

          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "| Hide" : "| Show"}
            </button>
          </div>
        </div>

        {error && (
          <p className="register-error">
            {error}
          </p>
        )}

        
        {success && (
          <p className="register-success">
            {success}
          </p>
        )}

        <button
          className="register-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>



        <button
          className="register-page-button"
          type="button"
          disabled={loading}
          onClick={() => {
            setShowRegisterPage(false);
            setPassword("");
            setError("");
            setSuccess("");
            setUsername(getRememberedUsername() ?? "");
          }}
        > Back to Login
        </button>
      </form>
    </div>
    ) : (

    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmitLogin}>
        <div className="login-header">
          <h1>Discueue</h1>
        </div>

        <h2>Log in</h2>

        <div className="login-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">Password</label>

          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "| Hide" : "| Show"}
            </button>
          </div>
        </div>

        <div className="login-remember">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            Remember username
          </label>
        </div>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <button
          className="register-page-button"
          type="button"
          onClick={() => {
            setShowRegisterPage(true);
            setUsername("");
            setPassword("");
            setError("");
            setSuccess("");
          }}
        >
          Register
        </button>
      </form>
    </div>
      )
  );


}