import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ViewDataset() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDataset = async () => {
    try {
      const res = await api.get("/admin/datasets");
      const rows = res.data || [];

      setData(rows);

      if (rows.length > 0) {
        // remove sentiment column if exists
        const cols = Object.keys(rows[0]).filter(
          (col) => col !== "sentiment"
        );
        setColumns(cols);
      }
    } catch (err) {
      console.error("Error fetching dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataset();
  }, []);

  return (
<div className="p-6">
      <h2 className="text-2xl font-bold mb-6">View Dataset</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 border text-left whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-4 text-center">
                    No dataset found
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className="border hover:bg-gray-50">
                    {columns.map((col, j) => (
                      <td
                        key={j}
                        className="px-4 py-2 border whitespace-nowrap text-left align-top"
                      >
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
