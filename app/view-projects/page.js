"use client";
import { useEffect, useState } from "react";

export default function ViewProjects() {
  const [projects, setProjects] = useState([]);
  const [bidForm, setBidForm] = useState({});

  // Fetch projects on load
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleBidChange = (projectId, field, value) => {
    setBidForm((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }));
  };

  const handleBidSubmit = async (projectId) => {
    const form = bidForm[projectId];

    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}/bids`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (res.ok) {
      alert("Bid submitted!");
      setBidForm((prev) => ({ ...prev, [projectId]: {} }));
    } else {
      alert("Failed to submit bid.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Available Projects</h2>
      {projects.map((project) => (
        <div
          key={project.id}
          style={{
            border: "1px solid gray",
            padding: "1rem",
            marginBottom: "1.5rem",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <p><strong>Budget:</strong> {project.budget}</p>
          <p><strong>Deadline:</strong> {project.deadline}</p>

          <h4>Place a Bid</h4>
          <input
            type="text"
            placeholder="Your Name"
            value={bidForm[project.id]?.sellerName || ""}
            onChange={(e) =>
              handleBidChange(project.id, "sellerName", e.target.value)
            }
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="number"
            placeholder="Bid Amount"
            value={bidForm[project.id]?.amount || ""}
            onChange={(e) =>
              handleBidChange(project.id, "amount", e.target.value)
            }
            style={{ width: "100%", marginBottom: 8 }}
          />
          <input
            type="text"
            placeholder="Estimated Time (e.g. 5 days)"
            value={bidForm[project.id]?.estimatedTime || ""}
            onChange={(e) =>
              handleBidChange(project.id, "estimatedTime", e.target.value)
            }
            style={{ width: "100%", marginBottom: 8 }}
          />
          <textarea
            placeholder="Why are you the right fit?"
            value={bidForm[project.id]?.message || ""}
            onChange={(e) =>
              handleBidChange(project.id, "message", e.target.value)
            }
            rows={3}
            style={{ width: "100%", marginBottom: 8 }}
          />

          <button
            onClick={() => handleBidSubmit(project.id)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Submit Bid
          </button>
        </div>
      ))}
    </div>
  );
}
