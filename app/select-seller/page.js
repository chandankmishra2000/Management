"use client";
import { useEffect, useState } from "react";

export default function SelectSellerPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [bids, setBids] = useState([]);
  const [email, setEmail] = useState("");

  // Fetch all projects
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // Fetch bids for a selected project
  const fetchBids = async (projectId) => {
    setSelectedProjectId(projectId);
    const res = await fetch(`http://localhost:5000/api/projects`);
    const allProjects = await res.json();
    const selected = allProjects.find((p) => p.id === projectId);
    setBids(selected?.bids || []);
  };

  // Select a seller
  const handleSelectSeller = async (bidId) => {
    const sellerEmail = prompt("Enter seller's email to notify:");

    const res = await fetch(`http://localhost:5000/api/projects/${selectedProjectId}/select`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bidId, sellerEmail }),
    });

    if (res.ok) {
      alert("Seller selected and notified!");
    } else {
      alert("Failed to select seller.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h2>Select Seller for a Project</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
            <h3>{project.title}</h3>
            <p>Status: {project.status}</p>
            <button onClick={() => fetchBids(project.id)}>View Bids</button>
          </li>
        ))}
      </ul>

      {selectedProjectId && (
        <div style={{ marginTop: 30 }}>
          <h3>Bids for Project #{selectedProjectId}</h3>
          {bids.length === 0 ? (
            <p>No bids yet.</p>
          ) : (
            <ul>
              {bids.map((bid) => (
                <li key={bid.id} style={{ borderBottom: "1px solid #eee", padding: 10 }}>
                  <strong>{bid.sellerName}</strong> - ₹{bid.amount} - {bid.estimatedTime}
                  <p>{bid.message}</p>
                  <button onClick={() => handleSelectSeller(bid.id)}>Select Seller</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
