import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";

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
      const res = await fetch(
        /* "http://127.0.0.1:8000/api/register/", */
        "https://notes-backend-awu3.onrender.com/api/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: regUsername,
            email: regEmail,
            password: regPassword,
          }),
        }
      );
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
      const res = await fetch(
        /* "http://127.0.0.1:8000/api/login/", */
        "https://notes-backend-awu3.onrender.com/api/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: loginUsername,
            password: loginPassword,
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data.access) {
        setToken(data.access);
        localStorage.setItem("token", data.access);
        setUser(loginUsername);
        localStorage.setItem("username", loginUsername);
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
    localStorage.removeItem("username");
    setPage("login");
  };

  // User page (protected)
  if (page === "user" && token) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  // Registration page
  if (page === "register") {
    return (
      <div className="container mt-5">
        <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 400 }}>
          <h2 className="mb-4 text-center">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
          <p className="text-danger text-center mt-2">{regMsg}</p>
          <button
            className="btn btn-link w-100 mt-2"
            onClick={() => setPage("login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Login page
  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 400 }}>
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <p className="text-danger text-center mt-2">{loginMsg}</p>
        <button
          className="btn btn-link w-100 mt-2"
          onClick={() => setPage("register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default App;
