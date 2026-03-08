import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ViewPositive() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPositive = async () => {
    try {
      const res = await api.get("/positive-feedback");
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
    fetchPositive();

    // ⭐ listen for new opinion submission
    window.addEventListener("opinionAdded", fetchPositive);

    return () => {
      window.removeEventListener("opinionAdded", fetchPositive);
    };
  }, []);

  return (
    <div className=" p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">
        Positive Feedback
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-green-600 text-white">
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
                    No positive feedback
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
