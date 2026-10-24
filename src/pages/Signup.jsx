
import { useState } from "react";
import "../App.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      if (!API_URL) {
        throw new Error("Backend URL is not configured.");
      }

      const response = await fetch(
        `${API_URL.replace(/\/+$/, "")}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed. Please try again.");
        return;
      }

      alert("Account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Signup error:", error);

      alert(
        error.message === "Backend URL is not configured."
          ? "Backend URL is missing. Please check Vercel environment variables."
          : "Could not connect to Pathora's backend. Please try again."
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
          <span className="eyebrow">START YOUR NEXT CHAPTER</span>

          <h1>
            Build your <span className="gradient-text">future.</span>
          </h1>

          <p>
            Create your account and start finding your direction.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="signup-password">Create password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            className="primary-btn auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account ↗"}
          </button>

          <p className="auth-switch">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Signup;
