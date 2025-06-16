"use client";
import { useState } from "react";

export default function HomePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Project created successfully!");
      setFormData({ title: "", description: "", budget: "", deadline: "" });
    } else {
      alert("Failed to create project");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Budget Range (e.g., $100 - $500)</label>
        <input
          type="text"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Project Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" style={{ padding: 10 }}>Submit Project</button>
      </form>
    </div>
  );
}
