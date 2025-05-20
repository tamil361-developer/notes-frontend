import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import { useRef } from "react";

function Navbar({ onLogout ,user}) {
  const navCollapse = useRef(null);

  // Toggle collapse for mobile
  const handleToggle = () => {
    if (navCollapse.current) {
      navCollapse.current.classList.toggle("show");
    }
  };

  // Helper to close navbar on menu click (for mobile)
  const handleNavLinkClick = () => {
    if (navCollapse.current && navCollapse.current.classList.contains("show")) {
      navCollapse.current.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg  custom-navbar fw-bold ">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={handleNavLinkClick}>
          {user}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse"
          id="navbarNav"
          ref={navCollapse}
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavLinkClick}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/allnotes"
                onClick={handleNavLinkClick}
              >
                All Notes
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-link nav-link"
                style={{ color: "#fff", textDecoration: "none" }}
                onClick={() => {
                  handleNavLinkClick();
                  if (onLogout) onLogout();
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
