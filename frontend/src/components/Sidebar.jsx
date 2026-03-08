import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UploadCloud,
  Database,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Youtube,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  // 🔵 MAIN ADMIN MENU
  const adminMain = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18}/> },
    { name: "Upload Dataset", path: "/admin/upload", icon: <UploadCloud size={18}/> },
    { name: "View All Dataset", path: "/admin/datasets", icon: <Database size={18}/> },
    { name: "Analyze Graph", path: "/admin/analyze", icon: <BarChart3 size={18}/> },
    { name: "Positive Feedback", path: "/admin/positive", icon: <ThumbsUp size={18}/> },
    { name: "Negative Feedback", path: "/admin/negative", icon: <ThumbsDown size={18}/> },
  ];

  // 🔴 YOUTUBE SECTION
  const youtubeMenu = [
    { name: "Upload YouTube URL", path: "/admin/fetch/upload", icon: <Youtube size={18}/> },
    { name: "YouTube Graph", path: "/admin/fetch/graph", icon: <BarChart3 size={18}/> },
  ];

  // 🟢 USER MENU
  const userMenu = [
    { name: "Dashboard", path: "/user/dashboard", icon: <LayoutDashboard size={18}/> },
    { name: "Give Opinion", path: "/user/GiveOpinion", icon: <MessageSquare size={18}/> },
  ];

  const logout = () => {
    localStorage.clear();
    nav("/", { replace: true });
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white fixed left-0 top-0 flex flex-col shadow-xl">

      {/* HEADER */}
      <div className="p-5 text-2xl font-bold border-b border-blue-500 text-center tracking-wide">
        {role === "admin" ? "Admin Panel" : "User Panel"}
      </div>

      {/* MENU */}
      <div className="flex-1 p-4 overflow-y-auto">

        {/* ADMIN MENU */}
        {role === "admin" && (
          <>
            <p className="text-xs text-blue-200 mb-2 px-2">DATASET</p>
            {adminMain.map((item, i) => {
              const active = location.pathname === item.path;

              return (
                <div
                  key={i}
                  onClick={() => nav(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all mb-1
                  ${
                    active
                      ? "bg-white text-blue-700 font-semibold shadow"
                      : "hover:bg-blue-600"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </div>
              );
            })}

            {/* YOUTUBE SECTION */}
            <p className="text-xs text-blue-200 mt-6 mb-2 px-2">YOUTUBE ANALYSIS</p>
            {youtubeMenu.map((item, i) => {
              const active = location.pathname === item.path;

              return (
                <div
                  key={i}
                  onClick={() => nav(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all mb-1
                  ${
                    active
                      ? "bg-white text-blue-700 font-semibold shadow"
                      : "hover:bg-blue-600"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </div>
              );
            })}
          </>
        )}

        {/* USER MENU */}
        {role === "user" &&
          userMenu.map((item, i) => {
            const active = location.pathname === item.path;

            return (
              <div
                key={i}
                onClick={() => nav(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all mb-1
                ${
                  active
                    ? "bg-white text-blue-700 font-semibold shadow"
                    : "hover:bg-blue-600"
                }`}
              >
                {item.icon}
                {item.name}
              </div>
            );
          })}
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg font-semibold transition"
        >
          <LogOut size={18}/> Logout
        </button>
      </div>
    </div>
  );
}
