import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState("");

  // Registration form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regMsg, setRegMsg] = useState("");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMsg("");
    try {
      const res = await fetch("https://notes-backend-awu3.onrender.com/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegMsg("Registration successful! Please login.");
        setPage("login");
      } else {
        setRegMsg(
          data.username?.[0] ||
            data.email?.[0] ||
            data.password?.[0] ||
            "Registration failed"
        );
      }
    } catch (err) {
      setRegMsg("Registration error");
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg("");
    try {
      const res = await fetch("https://notes-backend-awu3.onrender.com/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.access) {
        setToken(data.access);
        localStorage.setItem("token", data.access);
        setUser(loginUsername);
        setPage("user");
      } else {
        setLoginMsg(data.error || "Login failed");
      }
    } catch (err) {
      setLoginMsg("Login error");
    }
  };

  // Logout
  const handleLogout = () => {
    setToken("");
    setUser("");
    localStorage.removeItem("token");
    setPage("login");
  };

  // User page (protected)
  if (page === "user" && token) {
    return (
      <div className="card">
        <h2>Welcome, {user}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  // Registration page
  if (page === "register") {
    return (
      <div className="card">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            required
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit">Register</button>
        </form>
        <p style={{ color: "red" }}>{regMsg}</p>
        <button onClick={() => setPage("login")}>Back to Login</button>
      </div>
    );
  }

  // Login page
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p style={{ color: "red" }}>{loginMsg}</p>
      <button onClick={() => setPage("register")}>Register</button>
    </div>
  );
}

export default App;
