import React, { useState } from "react";
import { useRegisterMutation } from "../redux/api/userApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const navigate = useNavigate();
  const [register, { isLoading, isError, isSuccess, error }] =
    useRegisterMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username.length < 5) {
      return toast.error("Username must be at least 5 letters.");
    }
    if (formData.password.length < 5) {
      return toast.error("password must be at least 5 letters.");
    }
    const smallLater = formData.username.toLowerCase();
    try {
      const res = await register({
        username: smallLater,
        password: formData.password,
        email: formData.email,
      }).unwrap();
      toast.success(res.message);
      setFormData({ username: "", password: "", email: "" });
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Register</h2>

              {isError && (
                <div className="alert alert-danger" role="alert">
                  {error?.data?.message || "Something went wrong."}
                </div>
              )}
              {isSuccess && (
                <div className="alert alert-success" role="alert">
                  Registration successful!
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    {isLoading ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center text-muted">
              Already have an account? <a href="/login">Login here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
