import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-10 text-center">
        Admin Dashboard
      </h1>
      <div className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition duration-300 max-w-4xl w-full flex justify-center items-center">
        <img
          src="/Admin.png"
          alt="Citizen AI System"
          className="w-full max-h-[500px] object-contain rounded-xl"
        />
      </div>
      <p className="mt-10 text-gray-500 text-sm text-center">
        Citizen Opinion Analysis System • AI Powered
      </p>

    </div>
  );
}