import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Notecreatepage from "./Notecreatepage";

function Home({ user, onLogout }) {
  return (
    <>
      <Router>
        <Navbar onLogout={onLogout} user={user}/>
        <Routes>
          <Route path="/" element={<Notecreatepage user={user} />} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
        </Routes>
      </Router>
    </>
  );
}
export default Home;
