// src/components/FileManagement.js
import { useState, useEffect } from "react";

function FileManagement() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5050/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      alert(result.message);
      fetchFiles();
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:5050/files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const renameFile = async (fileId, newName) => {
    if (!newName) return;
    try {
      const response = await fetch("http://localhost:5050/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, newName }),
      });
      alert(await response.text());
      fetchFiles();
    } catch (error) {
      console.error("Error renaming file:", error);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const response = await fetch("http://localhost:5050/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      alert(await response.text());
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Google Drive File Management</h1>
      <form onSubmit={uploadFile}>
        <h3>Upload File</h3>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>

      <h3>Files in Google Drive</h3>
      <button onClick={fetchFiles}>Refresh Files</button>
      <div>
        {files.map((file) => (
          <div key={file.id} style={{ marginBottom: "10px" }}>
            <span>{file.name}</span>
            <button onClick={() => renameFile(file.id, prompt("Enter new name:", file.name))}>
              Rename
            </button>
            <button onClick={() => deleteFile(file.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileManagement;
