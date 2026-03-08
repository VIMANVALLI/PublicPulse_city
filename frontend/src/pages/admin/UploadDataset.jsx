import React, { useState } from "react";
import api from "../../services/api";
import { UploadCloud, FileSpreadsheet } from "lucide-react";

export default function UploadDataset() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (!allowedTypes.includes(selected.type)) {
      alert("Please upload Excel or CSV file");
      return;
    }

    setFile(selected);
    setMsg("");
  };

  const uploadDataset = async () => {
    if (!file) {
      alert("Select file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMsg("Uploading & Training model...");

      const res = await api.post("/admin/upload-dataset", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg(res.data.message || "Dataset uploaded successfully");
    } catch (err) {
      console.error(err);
      setMsg("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-700">
        Upload Dataset
      </h2>

      <div className="bg-white p-10 rounded-2xl shadow-xl w-[420px]">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-6 rounded-full">
            <UploadCloud size={40} className="text-blue-600" />
          </div>
        </div>

        {/* FILE BOX */}
        <label className="border-2 border-dashed border-blue-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">
          
          <FileSpreadsheet size={40} className="text-blue-500 mb-3" />

          <p className="text-gray-600 text-sm mb-2">
            {file ? file.name : "Click to select Excel/CSV file"}
          </p>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* BUTTON */}
        <button
          onClick={uploadDataset}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition
          ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700 shadow-lg"
          }`}
        >
          {loading ? "Training Model..." : "Upload Dataset"}
        </button>

        {/* MESSAGE */}
        {msg && (
          <p className="mt-5 text-center text-green-600 font-semibold">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
