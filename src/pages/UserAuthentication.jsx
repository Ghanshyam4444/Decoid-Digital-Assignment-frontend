import React, { useState } from "react";
import RegisterComponent from "../components/userAuth/RegisterComponent";
import LoginComponent from "../components/userAuth/LoginComponent";
import "bootstrap/dist/css/bootstrap.min.css";

const UserAuthentication = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "500px" }}>
        <ul className="nav nav-pills nav-justified mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${tabValue === 0 ? "active" : ""}`}
              onClick={() => setTabValue(0)}
            >
              Login
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tabValue === 1 ? "active" : ""}`}
              onClick={() => setTabValue(1)}
            >
              Register
            </button>
          </li>
        </ul>

        <div>{tabValue === 0 ? <LoginComponent /> : <RegisterComponent />}</div>
      </div>
    </div>
  );
};

export default UserAuthentication;
