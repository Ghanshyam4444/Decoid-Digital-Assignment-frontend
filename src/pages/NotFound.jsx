import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="display-1 text-danger fw-bold">404</h1>
      <h2 className="fw-bold">Oops! Page Not Found</h2>
      <p className="text-muted">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <span className="fs-1">🚀</span>
      <Link to="/" className="btn btn-primary mt-3 px-4 py-2">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
