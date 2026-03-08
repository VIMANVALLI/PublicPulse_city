import { useEffect, useState } from "react";
import API from "../../services/api";

export default function GiveOpinionPage() {
  const [schemes, setSchemes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const res = await API.get("/user/details");
      setSchemes(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const openBox = (row) => {
    setSelected(row);
    setShow(true);
  };

  const submit = async () => {
    if (!rating) {
      alert("Select rating");
      return;
    }

    try {
      const res = await API.post("/user/opinion", {
        record_id: selected.record_id,
        policy_id: selected.policy_id,
        description:
          selected.description ||
          selected.correct_ty_description ||
          selected.description_text ||
          "",
        date_announced:
          selected.date_announced ||
          selected.date_annc ||
          selected.date ||
          "",
        comment: comment,
        rating: rating,
        username: localStorage.getItem("username"),
      });

      // show sentiment returned from backend
      alert("Opinion submitted: " + (res.data?.sentiment || ""));

      // 🔥 IMPORTANT: tell all pages to refresh
      window.dispatchEvent(new Event("opinionAdded"));

      setShow(false);
      setComment("");
      setRating("");

    } catch (err) {
      console.error(err);
      alert("Error submitting opinion");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Give Opinion
      </h1>

      <div className="overflow-auto bg-white shadow p-4">
        <table className="min-w-full border text-sm">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2 border">Record ID</th>
              <th className="p-2 border">Policy ID</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {schemes.map((r, i) => (
              <tr key={i}>
                <td className="p-2 border">{r.record_id}</td>
                <td className="p-2 border">{r.policy_id}</td>
                <td className="p-2 border">
                  {r.description ||
                    r.correct_ty_description ||
                    r.description_text}
                </td>
                <td className="p-2 border">
                  {r.date_announced || r.date_annc}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => openBox(r)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Give Opinion
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow w-[400px]">
            <h2 className="text-xl font-bold mb-3">Give Opinion</h2>

            <textarea
              className="w-full border p-2 mb-3"
              placeholder="Write opinion"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <select
              className="w-full border p-2 mb-3"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select Rating</option>
              <option value="1">1 - Bad</option>
              <option value="2">2 - Poor</option>
              <option value="3">3 - Neutral</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>

            <button
              onClick={submit}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              Submit Opinion
            </button>

            <button
              onClick={() => setShow(false)}
              className="mt-2 text-red-600 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
