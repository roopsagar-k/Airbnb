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

    emailInput.current.value = "";
    passwordInput.current.value = "";
    setEmail("");
    setPassword("");
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center grow h-screen">
      <ToastContainer />
      <div className="-mt-32 p-4 sm:p-6 md:p-8">
        <h1 className="text-4xl text-center mb-4 sm:mb-6 md:mb-8">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={loginUser}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            ref={emailInput}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            ref={passwordInput}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="primary">Login</button>
          <div className="p-2 text-center">
            Don&apos;t have an account yet?{' '}
            <Link to="/register">
              <span className="text-primary underline font-medium">Register now</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
