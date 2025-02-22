import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function loginUser(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }

    try {
      const response = await axios.post("/login", {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        toast.success("Login successful! Redirecting...");
        setUser(response.data.user);
        setRedirect(true);
      } else {
        toast.error("Login failed: " + response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="auth-card">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={loginUser}>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              ref={emailInput}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-0"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              ref={passwordInput}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-0"
            />
          </div>

          <button type="submit" className="primary mt-6">
            Sign in
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}