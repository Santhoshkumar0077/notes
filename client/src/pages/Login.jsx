import React, { useState, useEffect } from "react";
import { useLoginMutation } from "../redux/api/userApi";
import { useDispatch } from "react-redux";
import { setUsername } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, isError, isSuccess, error }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    toast("Login into your account", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#0b472c",
        color: "#fff",
      },
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      dispatch(setUsername(res.username));
      toast.success(" Hello " + res.username);
      navigate("/");
      setFormData({ email: "", password: "" });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Login</h2>

              {isError && (
                <div className="alert alert-danger" role="alert">
                  {error?.data?.message || "Login failed. Try again."}
                </div>
              )}
              {isSuccess && (
                <div className="alert alert-success" role="alert">
                  Login successful!
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
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

                <div className="mb-4">
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
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-footer text-center text-muted">
              Don't have an account? <a href="/register">Register here</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
