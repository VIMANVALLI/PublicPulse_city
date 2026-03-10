import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 4) {
      alert("Password must be 4+ characters");
      return;
    }

    try {
      setLoading(true);

      await API.post("/signup", {
        username,
        email,
        password,
      });

      alert("Account created successfully");
      nav("/");
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-blue-600 p-6">

      <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">

        {/* Left Image */}
        <div className="w-1/2 hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31"
            alt="PublicPulse"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-6">
            <h1 className="text-white text-2xl font-bold text-center leading-snug">
              PUBLICPULSE
              <br />
              <span className="text-sm font-normal">
                Citizen Opinion Analysis System
              </span>
            </h1>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">

          <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSignup}>

            <input
              type="text"
              placeholder="Username"
              className="w-full border p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition">
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>

          <p className="text-sm mt-5 text-center">
            Already have an account?{" "}
            <span
              onClick={() => nav("/Login")}
              className="text-indigo-600 cursor-pointer font-semibold"
            >
              Login
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}
