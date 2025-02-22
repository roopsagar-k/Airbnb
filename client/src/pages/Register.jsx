import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  async function registerUser(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        toast.success("Registration successful! You can now login.");
        nameInput.current.value = "";
        emailInput.current.value = "";
        passwordInput.current.value = "";
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="auth-card">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-600">Join StayDnD today</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={registerUser}>
          <div>
            <label htmlFor="name" className="sr-only">Full name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="Full name"
              value={name}
              ref={nameInput}
              onChange={(e) => setName(e.target.value)}
              className="mb-0"
            />
          </div>
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
            Create account
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}