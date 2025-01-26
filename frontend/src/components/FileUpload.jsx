import { useState } from "react";
import upload from "../components/assets/upload.png";

function FileUpload() {
  const [file, setFile] = useState(null);

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
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
       <img src={upload} alt="upload" />
        <form onSubmit={uploadFile}>
          <div className="file-input-wrapper">
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
              required
            />
            <label htmlFor="file" className="file-label">
              Choose a file
            </label>
          </div>
          <button type="submit" className="upload-btn">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default FileUpload;
