import { useEffect, useState } from "react";
import API from "../../../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function FetchGraph() {
  const [positive, setPositive] = useState(0);
  const [negative, setNegative] = useState(0);
  const [neutral, setNeutral] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/youtube/summary");

      setPositive(res.data.positive);
      setNegative(res.data.negative);
      setNeutral(res.data.neutral);

    } catch (err) {
      console.log(err);
    }
  };

  const data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "YouTube Comments",
        data: [positive, negative, neutral],
        backgroundColor: ["green", "red", "gray"],
      },
    ],
  };

  return (
    <div style={{ width: "700px", margin: "40px auto" }}>
      <Bar data={data} />
    </div>
  );
}
