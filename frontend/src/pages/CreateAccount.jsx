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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Create Account
        </h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded-lg mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-lg mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-purple-600 text-white p-2 rounded-lg">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have account?{" "}
          <span
            onClick={() => nav("/")}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
