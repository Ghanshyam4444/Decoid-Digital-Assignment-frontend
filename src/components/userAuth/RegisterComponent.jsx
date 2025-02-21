import React, { useState } from "react";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterComponent = () => {
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const { storeTokenInLS, API } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({ ...userDetail, [name]: value });
  };

  const sendUserDetails = async (e) => {
    e.preventDefault();

    if (userDetail.password !== userDetail.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `https://decoid-digital-assignment-backend.vercel.app/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userDetail),
        }
      );

      const userInfo = await response.json();
      if (response.ok) {
        alert("Registration successful");
        setUserDetail({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        storeTokenInLS(userInfo.token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        navigate(`/`);
      } else {
        alert(userInfo.msg);
      }
    } catch (error) {
      alert("An error occurred, please try again");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: "24rem" }}>
        <h4 className="text-center mb-4">Create Account</h4>
        <form onSubmit={sendUserDetails}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={userDetail.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>

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
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={userDetail.phone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your phone number"
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

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={userDetail.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;
