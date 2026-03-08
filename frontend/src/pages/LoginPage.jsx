import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function LoginPage() {
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", {
        role,
        username,
        password,
      });

      if (!res.data.token) {
        alert(res.data.error || "Invalid login");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);  // ⭐ important

      if (role === "admin") nav("/admin/dashboard");
      else nav("/user/dashboard");

    } catch (err) {
      alert(err.response?.data?.detail || "Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Login
        </h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full border p-2 rounded-lg mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <button className="w-full bg-blue-600 text-white p-2 rounded-lg">
            Login
          </button>
        </form>

        {role === "user" && (
          <p className="text-sm mt-4 text-center">
            Don't have account?{" "}
            <span
              onClick={() => nav("/signup")}
              className="text-blue-600 cursor-pointer font-semibold"
            >
              Create Account
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
