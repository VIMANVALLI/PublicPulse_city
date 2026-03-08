import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
// AUTH
import LoginPage from "./pages/LoginPage";
import CreateAccount from "./pages/CreateAccount";
import HomePage from "./pages/HomePage";
// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import UploadDataset from "./pages/admin/UploadDataset";
import ViewDataset from "./pages/admin/ViewDataset";
import ViewGraph from "./pages/admin/ViewGraph";
import ViewPositive from "./pages/admin/ViewPositive";
import ViewNegative from "./pages/admin/ViewNegative";
import AdminLogout from "./pages/admin/Logout";
import FetchUpload from "./pages/admin/fetch/FetchUpload";
import FetchGraph from "./pages/admin/fetch/FetchGraph";
// USER
import UserDashboard from "./pages/user/UserDashboard";
import GiveOpinion from "./pages/user/GiveOpinion";
import UserLogout from "./pages/user/Logout";
function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">{children}</div>
    </div>
  );
}
function UserLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full">{children}</div>
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<CreateAccount />} />
        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard/></AdminLayout>} />
        <Route path="/admin/upload" element={<AdminLayout><UploadDataset/></AdminLayout>} />
        <Route path="/admin/datasets" element={<AdminLayout><ViewDataset/></AdminLayout>} />
        <Route path="/admin/analyze" element={<AdminLayout><ViewGraph/></AdminLayout>} />
        <Route path="/admin/positive" element={<AdminLayout><ViewPositive/></AdminLayout>} />
        <Route path="/admin/negative" element={<AdminLayout><ViewNegative/></AdminLayout>} />
        <Route path="/admin/fetch/upload" element={<AdminLayout><FetchUpload/></AdminLayout>} />
        <Route path="/admin/fetch/graph" element={<AdminLayout><FetchGraph/></AdminLayout>} />
        <Route path="/admin/logout" element={<AdminLogout />} />
        {/* USER */}
        <Route path="/user/dashboard" element={<UserLayout><UserDashboard/></UserLayout>} />
        <Route path="/user/GiveOpinion" element={<UserLayout><GiveOpinion/></UserLayout>} />
        <Route path="/user/logout" element={<UserLogout />} />
      </Routes>
    </BrowserRouter>
  );
}
