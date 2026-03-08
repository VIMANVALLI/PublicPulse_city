import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const nav = useNavigate();

  useEffect(() => {
    localStorage.clear();   // remove token + role
    nav("/");               // go back to login
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl">Logging out...</h2>
    </div>
  );
}
