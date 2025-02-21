import React, { useState } from "react";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginComponent = () => {
  const [userDetail, setUserDetail] = useState({
    email: "ghanshyammangla@gmail.com",
    password: "mangla",
  });
  const { storeTokenInLS, API } = useAuth();
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://decoid-digital-assignment-backend.vercel.app/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userDetail),
        }
      );
      const userInfo = await response.json();
      if (response.ok) {
        alert("Login successful");
        storeTokenInLS(userInfo.token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        navigate(`/`);
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      alert("An error occurred, please try again");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="card shadow p-4" style={{ width: "22rem" }}>
        <h4 className="text-center mb-4">Login</h4>
        <form onSubmit={loginUser}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={userDetail.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={userDetail.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
