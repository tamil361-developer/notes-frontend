import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Notecreatepage from "./Notecreatepage";
import Allnotes from "./Allnotes";

function Home({ user, onLogout }) {
  return (
    <>
      <Router>
        <Navbar onLogout={onLogout} user={user}/>
        <Routes>
          <Route path="/" element={<Notecreatepage user={user} />} />
          <Route path="/allnotes" element={<Allnotes  user={user}/>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
        </Routes>
      </Router>
    </>
  );
}
export default Home;
