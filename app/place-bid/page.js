"use client";
import { useState, useEffect } from "react";

export default function PlaceBidPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [bidData, setBidData] = useState({
    sellerName: "",
    amount: "",
    estimatedTime: "",
    message: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  const handleChange = (e) => {
    setBidData({ ...bidData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return alert("Please select a project.");

    const res = await fetch(
      `http://localhost:5000/api/projects/${selectedProject}/bids`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bidData),
      }
    );

    if (res.ok) {
      alert("Bid placed successfully!");
      setBidData({ sellerName: "", amount: "", estimatedTime: "", message: "" });
    } else {
      alert("Failed to place bid");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Place a Bid</h2>
      <form onSubmit={handleSubmit}>
        <label>Select Project</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
          required
        >
          <option value="">-- Choose a project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        <label>Seller Name</label>
        <input
          type="text"
          name="sellerName"
          value={bidData.sellerName}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Bid Amount</label>
        <input
          type="number"
          name="amount"
          value={bidData.amount}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Estimated Completion Time</label>
        <input
          type="text"
          name="estimatedTime"
          value={bidData.estimatedTime}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Why are you a good fit?</label>
        <textarea
          name="message"
          value={bidData.message}
          onChange={handleChange}
          required
          rows={3}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" style={{ padding: 10 }}>
          Submit Bid
        </button>
      </form>
    </div>
  );
}
