"use client";
import { useState } from "react";

export default function UploadPage() {
  const [projectId, setProjectId] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !projectId) return alert("Select file and enter Project ID");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`http://localhost:5000/api/projects/${projectId}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) alert("Upload successful");
    else alert(data.error || "Upload failed");
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Upload Deliverable</h2>
      <form onSubmit={handleUpload}>
        <label>Project ID</label>
        <input
          type="number"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <label>Deliverable File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
