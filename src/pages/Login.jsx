
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (!data.token || !data.user) {
        setError("The server did not return a valid login response.");
        return;
      }

      // Store the token for subsequent authenticated requests.
      // For production, prefer a secure, HttpOnly cookie strategy.
      sessionStorage.setItem("pathora_token", data.token);
      sessionStorage.setItem(
        "pathora_user",
        JSON.stringify(data.user)
      );

      setSuccess("Login successful! Redirecting...");

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Cannot connect to Pathora. Check that the backend is running and CORS is configured."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app auth-page">
      <a className="brand auth-brand" href="/">
        <span className="brand-icon">P</span>
        pathora<span className="brand-dot">.</span>
      </a>

      <main className="auth-container">
        <div className="auth-heading">
          <span className="eyebrow">WELCOME BACK</span>

          <h1>
            Continue your{" "}
            <span className="gradient-text">journey.</span>
          </h1>

          <p>Sign in to pick up where your growth left off.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <label htmlFor="login-email">Email address</label>

          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>

          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p role="alert" style={{ color: "#ff7777" }}>
              {error}
            </p>
          )}

          {success && (
            <p role="status" style={{ color: "#65d6a0" }}>
              {success}
            </p>
          )}

          <button
            className="primary-btn auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in ↗"}
          </button>

          <p className="auth-switch">
            New to Pathora?{" "}
            <a href="/signup">Create an account</a>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Login;
