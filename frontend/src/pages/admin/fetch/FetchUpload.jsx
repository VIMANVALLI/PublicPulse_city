import React, { useState } from "react";
import axios from "axios";

function FetchUpload() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!url) {
      setMessage("Please enter YouTube URL");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:8000/youtube/fetch",   // ✅ FIXED HERE
        { url: url }
      );

      setMessage(
        `Successfully fetched ${response.data.count} comments`
      );
    } catch (error) {
      console.error(error);
      setMessage("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h4>Fetch YouTube Comments</h4>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={handleFetch}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Data"}
        </button>

        {message && (
          <p
            className="mt-3"
            style={{
              color: message.includes("Error") ? "red" : "green",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default FetchUpload;
