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
      localStorage.setItem("username", username);

      if (role === "admin") nav("/admin/dashboard");
      else nav("/user/dashboard");

    } catch (err) {
      alert(err.response?.data?.detail || "Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-blue-600 p-6">

      <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">

        {/* Left Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src={role === "admin" ? "/login.jpg" : "/user-login.png"}
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 relative">

          {/* Role Badge */}
          <div className="absolute -right-6 top-6 bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg">
            {role === "admin" ? "Admin Login" : "User Login"}
          </div>

          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Login Form
          </h2>

          {/* Role Select */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded-lg mb-4"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <form onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="User Name"
              className="w-full border p-2 rounded-lg mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded-lg mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
              Log in
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
    </div>
  );
}
