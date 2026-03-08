import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ViewGraph() {
  const [counts, setCounts] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  // fetch counts from backend
  const fetchData = async () => {
    try {
      const res = await api.get("/sentiment-counts");
      setCounts(res.data);
    } catch (err) {
      console.error("Graph error:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // ⭐ listen when new opinion is submitted
    window.addEventListener("opinionAdded", fetchData);

    return () => {
      window.removeEventListener("opinionAdded", fetchData);
    };
  }, []);

  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "Sentiment Count",
        data: [counts.positive, counts.negative, counts.neutral],
        backgroundColor: ["green", "red", "orange"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  return (
    <div className="ml-64 p-6">
      <h2 className="text-2xl font-bold mb-6">Sentiment Graph</h2>

      <div className="bg-white p-6 rounded shadow w-[600px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
