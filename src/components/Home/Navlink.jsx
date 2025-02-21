import React from "react";
import { NavLink } from "react-router-dom";
import "./Navlink.css";

const NavLinks = () => {
  return (
    <div className="header-container bg-dark">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          {/* Navbar Brand */}
          <NavLink
            className="navbar-brand fs-3"
            style={{ color: "cyan" }}
            to="/"
          >
            MyApp
          </NavLink>

          {/* Toggle button for smaller screens */}
          <button
            className="navbar-toggler ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link p-font" to="/">
                  Available Quizzes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link p-font" to="/CreateQuiz">
                  Create Quiz
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link p-font" to="/MyQuiz">
                  My Quizzes
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavLinks;
