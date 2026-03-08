import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ViewNegative() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNegative = async () => {
    try {
      const res = await api.get("/negative-feedback");
      const rows = res.data || [];

      setData(rows);

      if (rows.length > 0) {
        setColumns(Object.keys(rows[0]));
      }
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNegative();

    // ⭐ listen for new opinion submission
    window.addEventListener("opinionAdded", fetchNegative);

    return () => {
      window.removeEventListener("opinionAdded", fetchNegative);
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-600">
        Negative Feedback
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-red-600 text-white">
                {columns.map((col, i) => (
                  <th key={i} className="px-4 py-2 border text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-4 text-center">
                    No negative feedback
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className="border hover:bg-gray-50">
                    {columns.map((col, j) => (
                      <td key={j} className="px-4 py-2 border">
                        {col === "link" ? (
                          <a
                            href={row[col]}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          row[col]
                        )}
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
